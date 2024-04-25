"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
/**
 * Represents a command that can be sent to a modem.
 */
class Command {
    /**
     * Constructs a new instance of the Command class.
     *
     * @param ATCommand The AT command string to be sent to the device.
     * @param timeout The maximum time in milliseconds to wait for a response from the device.
     * @param callback A callback function that is called when a response is received or an error occurs.
     * @param awaitResponse Whether to await a response from the device after sending the command.
     */
    constructor(ATCommand, timeout = 3000, callback = () => undefined, awaitResponse = true) {
        this.ATCommand = ATCommand;
        this.timeout = timeout;
        this.callback = callback;
        this.awaitResponse = awaitResponse;
        /**
         * Indicates if the command is considered deprecated.
         * If deprecated, the command will be skipped.
         */
        this.deprecated = false;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map