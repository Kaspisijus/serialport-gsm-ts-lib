"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialPortCommunicator = void 0;
const serialport_1 = require("serialport");
/**
 * Represents a communicator using the SerialPort library for communication with hardware devices.
 */
class SerialPortCommunicator {
    constructor(device, options = {}) {
        const serialPortOptions = Object.assign(
        // defaults
        {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            highWaterMark: 16384,
            parity: 'none',
            rtscts: false,
            xon: false,
            xoff: false
        }, 
        // options
        options, 
        // overide options
        {
            path: device,
            autoOpen: false
        });
        this.device = device;
        this.serialPort = new serialport_1.SerialPort(serialPortOptions);
    }
    /*
     * ================================================
     *                      Getter
     * ================================================
     */
    /**
     * Gets the identifier for the communication device.
     *
     * @returns The device identifier.
     */
    get deviceIndentifier() {
        return `serialport-${this.serialPort.path}-${this.device}`;
    }
    /**
     * Checks if the communication device is currently connected.
     *
     * @returns True if the device is connected, otherwise false.
     */
    get isConnected() {
        return this.serialPort.isOpen;
    }
    /*
     * ================================================
     *                 Public functions
     * ================================================
     */
    /**
     * Connects to the serial port device.
     */
    async connect() {
        await new Promise((resolve, reject) => {
            this.serialPort.open((error) => {
                if (error !== null) {
                    reject(error);
                }
                resolve(true);
            });
        });
    }
    /**
     * Disconnects from the serial port device.
     */
    async disconnect() {
        await new Promise((resolve, reject) => {
            this.serialPort.close((error) => {
                if (error !== null) {
                    reject(error);
                }
                resolve(true);
            });
        });
    }
    /**
     * Sets a callback function to handle incoming data from the serial port.
     *
     * @param func The function to be called with received data.
     */
    async setOnResiveFunc(func) {
        this.serialPort.on('data', (dataBuffer) => func(dataBuffer.toString()));
    }
    /**
     * Writes data to the serial port.
     *
     * @param data The data to be written.
     */
    async write(data) {
        this.serialPort.write(data);
    }
    /**
     * Retrieves a list of available serial ports.
     * @see https://serialport.io/docs/api-bindings-cpp#list
     *
     * @returns A promise resolving to an array of available serial ports.
     */
    static async listDevices() {
        return serialport_1.SerialPort.list();
    }
}
exports.SerialPortCommunicator = SerialPortCommunicator;
//# sourceMappingURL=SerialPortCommunicator.js.map