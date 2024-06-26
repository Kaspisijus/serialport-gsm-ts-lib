import { Modem } from '../Modem';
import { Command } from './Command';
import { CommandResponse } from './types';
/**
 * Simplifies the response from a command sent to the modem by returning only the first line of the response.
 *
 * @param response The promise resolving to the command response from the modem.
 * @returns A promise that resolves to the first line of the command response or an empty string if there's no response.
 */
export declare function simplifyResponse(response: Promise<CommandResponse>): Promise<string>;
/**
 * Determines the result code of a modem response.
 * This function checks if the response string includes an 'ERROR' or if it does not strictly equal 'OK'.
 *
 * @param response The response string from the modem.
 * @returns 'ERROR' if the response indicates an error, 'OK' otherwise.
 */
export declare function resultCode(response: string): "ERROR" | "OK";
/**
 * Custom error class for handling errors related to modem operations.
 * Extends the native JavaScript `Error` class.
 */
export declare class ModemError extends Error {
    /**
     * Creates an instance of ModemError.
     *
     * @param modem The modem instance that encountered the error.
     * @param message The error message.
     */
    constructor(modem: Modem, message: string);
}
/**
 * Enum for modem operation modes.
 */
export declare enum ModemMode {
    PDU = "PDU",
    TEXT = "TEXT"
}
/**
 * Defines the structure for a command stack that can be sent to the modem.
 * A command stack is a collection of commands that are executed in sequence.
 */
export type CmdStack = {
    cmds: Command[];
    cancelOnFailure: boolean;
    onFinish?: () => void;
    onFailed?: (e: Error) => void;
};
