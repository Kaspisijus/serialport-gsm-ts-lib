import { Modem } from '../Modem';
import { Command } from './Command';
import { Communicator } from './Communicator';
import { Events } from './Events';
import { CmdStack } from './utils';
/**
 * Handles the execution and processing of AT commands for the modem.
 */
export declare class CommandHandler {
    private readonly modem;
    private readonly communicator;
    private readonly events;
    readonly prioQueue: (Command | CmdStack)[];
    readonly queue: (Command | CmdStack)[];
    private isLocked;
    private interval;
    private receivedData;
    private receivedCmdResponse;
    constructor(modem: Modem, communicator: Communicator, events: Events);
    /**
     * Executes the next command in the queue.
     * Locks the execution to prevent concurrent command execution.
     * Resolves once the command is executed.
     *
     * @returns The executed command or `undefined` if no command is available.
     */
    private executeNextCmd;
    /**
     * Executes a single AT command.
     * Resolves with the command response or an error if the command times out or encounters an issue.
     *
     * @param cmd The AT command to execute.
     * @returns The command response or an error if the command fails.
     */
    private executeCMD;
    /**
     * Handles the data received from the modem.
     * Processes the received data, emits events, and triggers command responses.
     *
     * @param received The received data from the modem.
     */
    private dataReceived;
    /**
     * Starts processing the command queue.
     */
    startProcessing(): void;
    /**
     * Stops processing the command queue.
     */
    stopProcessing(): void;
    /**
     * Adds a command or command stack to the processing queue.
     *
     * @param cmd The command or command stack to add to the queue.
     * @param prio If true, adds the command to the priority queue; otherwise, adds it to the regular queue.
     */
    pushToQueue(cmd: Command | CmdStack, prio?: boolean): void;
}
