"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModemMode = exports.ModemError = exports.resultCode = exports.simplifyResponse = void 0;
/**
 * Simplifies the response from a command sent to the modem by returning only the first line of the response.
 *
 * @param response The promise resolving to the command response from the modem.
 * @returns A promise that resolves to the first line of the command response or an empty string if there's no response.
 */
async function simplifyResponse(response) {
    return (await response)[0] || '';
}
exports.simplifyResponse = simplifyResponse;
/**
 * Determines the result code of a modem response.
 * This function checks if the response string includes an 'ERROR' or if it does not strictly equal 'OK'.
 *
 * @param response The response string from the modem.
 * @returns 'ERROR' if the response indicates an error, 'OK' otherwise.
 */
function resultCode(response) {
    if (response.toUpperCase().includes('ERROR') || response.toLocaleUpperCase().trim() !== 'OK') {
        return 'ERROR';
    }
    return 'OK';
}
exports.resultCode = resultCode;
/**
 * Custom error class for handling errors related to modem operations.
 * Extends the native JavaScript `Error` class.
 */
class ModemError extends Error {
    /**
     * Creates an instance of ModemError.
     *
     * @param modem The modem instance that encountered the error.
     * @param message The error message.
     */
    constructor(modem, message) {
        super(`serialport-gsm/${modem.device}: ${message}`);
    }
}
exports.ModemError = ModemError;
/**
 * Enum for modem operation modes.
 */
var ModemMode;
(function (ModemMode) {
    ModemMode["PDU"] = "PDU";
    ModemMode["TEXT"] = "TEXT";
})(ModemMode || (exports.ModemMode = ModemMode = {}));
//# sourceMappingURL=utils.js.map