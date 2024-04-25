import { AutoDetectTypes } from '@serialport/bindings-cpp';
import { SerialPortOpenOptions } from 'serialport/dist/index';
import { Communicator } from '../utils/Communicator';
/**
 * Represents a communicator using the SerialPort library for communication with hardware devices.
 */
export declare class SerialPortCommunicator implements Communicator {
    private readonly device;
    private readonly serialPort;
    constructor(device: string, options?: Partial<SerialPortOptions>);
    /**
     * Gets the identifier for the communication device.
     *
     * @returns The device identifier.
     */
    get deviceIndentifier(): string;
    /**
     * Checks if the communication device is currently connected.
     *
     * @returns True if the device is connected, otherwise false.
     */
    get isConnected(): boolean;
    /**
     * Connects to the serial port device.
     */
    connect(): Promise<void>;
    /**
     * Disconnects from the serial port device.
     */
    disconnect(): Promise<void>;
    /**
     * Sets a callback function to handle incoming data from the serial port.
     *
     * @param func The function to be called with received data.
     */
    setOnResiveFunc(func: (data: string) => void): Promise<void>;
    /**
     * Writes data to the serial port.
     *
     * @param data The data to be written.
     */
    write(data: string): Promise<void>;
    /**
     * Retrieves a list of available serial ports.
     * @see https://serialport.io/docs/api-bindings-cpp#list
     *
     * @returns A promise resolving to an array of available serial ports.
     */
    static listDevices(): Promise<import("@serialport/bindings-interface").PortInfo[]>;
}
/**
 * @see https://serialport.io/docs/api-bindings-cpp#open
 */
export type SerialPortOptions = SerialPortOpenOptions<AutoDetectTypes>;
