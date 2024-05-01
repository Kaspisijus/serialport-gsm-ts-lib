"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const node_pdu_1 = require("node-pdu");
const Command_1 = require("./Command");
/**
 * Handles the execution and processing of AT commands for the modem.
 */
class CommandHandler {
    constructor(modem, communicator, events) {
        // queued commands
        this.prioQueue = [];
        this.queue = [];
        // sending commands
        this.isLocked = false;
        this.interval = null;
        // receiving data
        this.receivedData = '';
        this.receivedCmdResponse = [];
        this.modem = modem;
        this.communicator = communicator;
        this.events = events;
        this.communicator.setOnResiveFunc((data) => this.dataReceived(data));
    }
    /*
     * ================================================
     *            Sending commands to modem
     * ================================================
     */
    /**
     * Executes the next command in the queue.
     * Locks the execution to prevent concurrent command execution.
     * Resolves once the command is executed.
     *
     * @returns The executed command or `undefined` if no command is available.
     */
    async executeNextCmd() {
        if (this.isLocked || !this.communicator.isConnected) {
            return;
        }
        const item = this.prioQueue.shift() || this.queue.shift();
        if (item === undefined) {
            return;
        }
        this.isLocked = true;
        if (item instanceof Command_1.Command) {
            this.modem.logger?.log("---------\nexecuteCMD: ", item.ATCommand);
            await this.executeCMD(item)
                .then((res) => {
                this.modem.logger?.log("res: ", res);
                return res;
            }).catch((err) => {
                this.modem.logger?.log("err: ", err);
                return err;
            });
        }
        else {
            for (const cmd of item.cmds) {
                this.modem.logger?.log("---------\nexecuteCMDs: ", cmd.ATCommand);
                const result = await this.executeCMD(cmd)
                    .then((res) => {
                    this.modem.logger?.log("res: ", res);
                    return res;
                }).catch((err) => {
                    this.modem.logger?.log("err: ", err);
                    return err;
                });
                if (result instanceof Error && item.cancelOnFailure) {
                    if (item.onFailed) {
                        item.onFailed(result);
                    }
                    break;
                }
            }
            if (item.onFinish) {
                item.onFinish();
            }
        }
        this.isLocked = false;
        return item;
    }
    /**
     * Executes a single AT command.
     * Resolves with the command response or an error if the command times out or encounters an issue.
     *
     * @param cmd The AT command to execute.
     * @returns The command response or an error if the command fails.
     */
    async executeCMD(cmd) {
        const result = await new Promise((resolve) => {
            if (cmd.deprecated) {
                return resolve(new Error('Command marked as deprecated'));
            }
            const write = `${cmd.ATCommand}\r`;
            this.events.emit('onWriteToModem', write);
            this.communicator.write(write);
            if (cmd.awaitResponse === false) {
                return setTimeout(() => resolve([]), cmd.timeout);
            }
            let timeout = setTimeout(() => resolve(new Error('Command is timeouted!')), cmd.timeout);
            const resetTimeout = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.events.removeListener('onDataReceived', resetTimeout);
                    resolve(new Error('Command is timeouted!'));
                }, cmd.timeout);
            };
            this.events.on('onDataReceived', () => resetTimeout());
            this.events.once('onCommandResponse', (data) => {
                this.events.removeListener('onDataReceived', resetTimeout);
                clearTimeout(timeout);
                resolve(data);
            });
        });
        try {
            cmd.callback(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
        return result;
    }
    /*
     * ================================================
     *            Receiving data from modem
     * ================================================
     */
    /**
     * Handles the data received from the modem.
     * Processes the received data, emits events, and triggers command responses.
     *
     * @param received The received data from the modem.
     */
    dataReceived(received) {
        this.receivedData += received;
        const parts = this.receivedData.split('\r\n');
        this.receivedData = parts.pop() || '';
        for (const part of parts) {
            this.events.emit('onDataReceived', part + '\r\n');
            if (part.trim() === '') {
                continue;
            }
            // skip echoes from commands
            if (part.toUpperCase().startsWith('AT')) {
                continue;
            }
            // new incomming SMS
            if (part.toUpperCase().startsWith('+CMTI:')) {
                const smsID = Number(part.match(/\d+/g)?.[1] || NaN);
                if (!isNaN(smsID)) {
                    this.events.emit('onNewSms', smsID);
                }
                continue;
            }
            // new incomming call
            if (part.toUpperCase().startsWith('+CLIP')) {
                const splitted_newpart = part.substring(6).split(',');
                if (splitted_newpart[0] && splitted_newpart[1]) {
                    const foundNumbers = /"(.*?)"/g.exec(splitted_newpart[0]);
                    this.events.emit('onNewIncomingCall', {
                        phoneNumber: foundNumbers !== null && foundNumbers[1] ? foundNumbers[1] : 'unknown',
                        scheme: splitted_newpart[1]
                    });
                }
                continue;
            }
            if (part.toUpperCase().includes('^SMMEMFULL')) {
                this.modem.checkSimMemory(true);
                continue;
            }
            if (part.toUpperCase().startsWith('+CUSD:')) {
                const splitted_newpart = part.substring(7).split(',');
                const followCode = Number(splitted_newpart[0]);
                let text;
                let follow;
                switch (followCode) {
                    case 0:
                        follow = 'no further action required';
                        break;
                    case 1:
                        follow = 'further action required';
                        break;
                    case 2:
                        follow = 'terminated by network';
                        break;
                    case 3:
                        follow = 'operation not supported';
                        break;
                }
                if (splitted_newpart.length > 1) {
                    const decodable = /"(.*?)"/g.exec(splitted_newpart[1]);
                    if (decodable !== null && decodable.length > 1) {
                        text = node_pdu_1.utils.Helper.decode16Bit(decodable[1]);
                    }
                    else {
                        text = splitted_newpart[1];
                    }
                }
                this.events.emit('onNewIncomingUSSD', { text, follow, followCode });
                continue;
            }
            // Kaspis hack fix hangup bug when RING command interrupts hangup process..
            if (part.trim().toUpperCase() !== 'RING') {
                this.receivedCmdResponse.push(part);
            }
            if ((part.trim().toUpperCase() === 'OK' || part.toUpperCase().includes('ERROR')) && this.receivedCmdResponse.length > 0) {
                this.events.emit('onCommandResponse', this.receivedCmdResponse);
                this.receivedCmdResponse = [];
            }
        }
    }
    /*
     * ================================================
     *                 Public functions
     * ================================================
     */
    /**
     * Starts processing the command queue.
     */
    startProcessing() {
        if (this.interval !== null) {
            return;
        }
        this.interval = setInterval(() => this.executeNextCmd().catch(() => (this.isLocked = false)), 10);
    }
    /**
     * Stops processing the command queue.
     */
    stopProcessing() {
        if (this.interval === null) {
            return;
        }
        clearInterval(this.interval);
        this.interval = null;
    }
    /**
     * Adds a command or command stack to the processing queue.
     *
     * @param cmd The command or command stack to add to the queue.
     * @param prio If true, adds the command to the priority queue; otherwise, adds it to the regular queue.
     */
    pushToQueue(cmd, prio = false) {
        if (prio) {
            this.prioQueue.push(cmd);
            return;
        }
        this.queue.push(cmd);
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map