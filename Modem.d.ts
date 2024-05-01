import { Deliver, Submit } from 'node-pdu';
import { Communicator } from './utils/Communicator';
import { EventTypes } from './utils/Events';
import { CommandResponse, ModemOptions, PduSms, SendSmsSuccess, SimMemoryInformation } from './utils/types';
export declare class Modem {
    private readonly options;
    private readonly communicator;
    private readonly events;
    private readonly cmdHandler;
    logger: Console | undefined;
    constructor(communicator: Communicator, options?: Partial<ModemOptions>);
    /**
     * A getter method to retrieve a unique identifier for the modem device.
     *
     * @returns A string that represents the unique device identifier.
     */
    get device(): string;
    /**
     * Checks whether the modem is currently open and connected. This can be used to verify
     * the connection status before attempting to send commands or messages.
     *
     * @returns True if the modem is connected, otherwise false.
     */
    get isOpen(): boolean;
    /**
     * Retrieves the total length of the command queue.
     *
     * @returns The total number of commands currently queued for execution.
     */
    get queueLength(): number;
    /**
     * Checks if the modem requires a PIN for operation.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns True if a PIN is required, false otherwise.
     */
    private checkPinRequired;
    /**
     * Enables the Caller Line Identification Presentation (CLIP) feature on the modem, allowing
     * the modem to present the caller's number when receiving a call.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    private enableClip;
    /**
     * Configures the modem to notify the host when new SMS messages are received,
     * using the CNMI (New SMS Message Indications) setting.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    private enableCNMI;
    /**
     * Sets the modem's echo mode. When enabled, the modem echoes characters received from the terminal.
     *
     * @param enable Whether to enable or disable echo mode.
     * @param prio Whether this action should be prioritised in the command queue.
     */
    private setEchoMode;
    /**
     * Provides the SIM card's PIN to the modem, if required. This is necessary for unlocking the modem
     * for use when a PIN code is set on the SIM card.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    private providePin;
    /**
     * Resets the modem to its factory settings. This is often used to ensure a clean state before
     * configuring the modem for specific tasks.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    private resetModem;
    /**
     * Sets the SMS message format of the modem. Modems support either PDU (Protocol Data Unit) or
     * Text mode for sending and receiving SMS messages. This method configures the modem to use
     * one of these formats.
     *
     * @param mode The SMS message format mode.
     * @param prio Whether this action should be prioritised in the command queue.
     */
    private setMode;
    /**
     * Opens the connection to the modem and initiates the connection.
     */
    open(): Promise<void>;
    /**
     * Closes the connection to the modem. This method stops processing AT commands,
     * disconnects the communicator interface.
     */
    close(): Promise<void>;
    /**
     * Executes a given AT command on the modem.
     *
     * @param command The AT command to be executed.
     * @param prio Whether this action should be prioritised in the command queue.
     * @param cmdtimeout Optional timeout for the command execution.
     *
     * @returns A promise that resolves with the command response or rejects with an error.
     */
    executeATCommand(command: string, prio?: boolean, cmdtimeout?: number): Promise<CommandResponse>;
    /**
     * Initializes the modem with specified settings. This includes checking the modem's status,
     * resetting it, setting echo mode, providing a PIN if required, executing a custom initialization
     * command, setting the modem mode to PDU, and enabling caller identification.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    initializeModem(prio?: boolean): Promise<void>;
    /**
     * Checks if the modem is responsive by sending a basic AT command.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise that resolves if the modem responds correctly.
     */
    checkModem(prio?: boolean): Promise<{
        status: 'OK';
    }>;
    /**
     * Sends an SMS message to a specified number. Allows for sending flash SMS by setting the
     * data coding scheme accordingly.
     *
     * @param number The recipient's phone number.
     * @param message The text message to be sent.
     * @param flashSms Whether the message should be sent as a flash SMS.
     * @param prio Whether this action should be prioritised in the command queue.
     *
     * @returns A promise that resolves when the SMS has been sent.
     */
    sendSms(number: string, message: string, flashSms?: boolean, prio?: boolean): Promise<SendSmsSuccess<Submit>>;
    /**
     * Sends a PDU (Protocol Data Unit) formatted SMS using the provided PDU class.
     *
     * @param pdu The PDU object representing the SMS to be sent.
     * @param prio Whether this action should be prioritised in the command queue.
     *
     * @returns A promise indicating the success of the SMS sending.
     */
    sendPdu<T extends Submit | Deliver>(pdu: T, prio?: boolean): Promise<SendSmsSuccess<T>>;
    /**
     * Retrieves information about the current network signal strength and quality.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise with an object containing signal quality and strength.
     */
    getSignalInfo(prio?: boolean): Promise<{
        signalQuality: number;
        signalStrength: number;
    }>;
    /**
     * Retrieves information about the currently registered network.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise with an object containing network information.
     */
    getRegisteredNetwork(prio?: boolean): Promise<{
        mode: string;
        name: string | undefined;
        shortName: string | undefined;
        numeric: string | undefined;
    }>;
    /**
     * Retrieves a list of available networks that the modem can see at the moment.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise that resolves with a list of available networks.
     */
    getAvailableNetworks(prio?: boolean): Promise<{
        status: string;
        name: string;
        shortName: string | undefined;
        numeric: string | undefined;
    }[]>;
    /**
     * Checks the SIM card memory usage for stored SMS messages.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise that resolves with the SIM memory usage information.
     */
    checkSimMemory(prio?: boolean): Promise<SimMemoryInformation>;
    /**
     * Selects the phone book storage to be used for subsequent operations.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    selectPhonebookStorage(prio?: boolean): Promise<void>;
    /**
     * Writes an entry to the phone book storage.
     *
     * @param phoneNumber The phone number to store.
     * @param name The name associated with the phone number.
     * @param prio Whether this action should be prioritised in the command queue.
     */
    writeToPhonebook(phoneNumber: string, name: string, prio?: boolean): Promise<void>;
    /**
     * Sets the own phone number in the modem's phone book storage.
     * This method first selects the phone book storage and then writes the provided phone number and name into it.
     *
     * @param phoneNumber The phone number to set as the own number.
     * @param name The name associated with the phone number, defaults to 'OwnNumber'.
     * @param prio Whether this action should be prioritised in the command queue.
     */
    setOwnPhoneNumber(phoneNumber: string, name?: string, prio?: boolean): Promise<void>;
    /**
     * Retrieves the product serial number of the modem.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise that resolves with the modem's serial number.
     */
    getProductSerialNumber(prio?: boolean): Promise<string>;
    /**
     * Retrieves the own phone number stored in the modem.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise that resolves with the name and phone number.
     */
    getOwnNumber(prio?: boolean): Promise<{
        name: string;
        phoneNumber: string;
    }>;
    /**
     * Hangs up the current call. Sends an ATH command to the modem to terminate the ongoing call.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    hangupCall(prio?: boolean): Promise<void>;
    /**
     * Sends a USSD command to the modem for execution.
     *
     * @param command The USSD command to be executed.
     * @param prio Whether this action should be prioritised in the command queue.
     */
    sendUSSD(command: string, prio?: boolean): Promise<void>;
    /**
     * Deletes all SMS messages stored on the modem.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     */
    deleteAllSms(prio?: boolean): Promise<void>;
    /**
     * Deletes a specific SMS message by its index.
     *
     * @param id The index of the SMS message to be deleted.
     * @param prio Whether this action should be prioritised in the command queue.
     */
    deleteSms(id: number, prio?: boolean): Promise<void>;
    /**
     * Deletes a specified SMS message and its referenced messages.
     * This method is designed to delete both the specified SMS message and any referenced messages.
     *
     * @param message The SMS message to be deleted along with its referenced messages.
     * @param prio Whether this action should be prioritised in the command queue.
     *
     * @returns A promise that resolves a object containing arrays of deleted and failed message indexes.
     */
    deleteMessage(message: PduSms, prio?: boolean): Promise<{
        deleted: number[];
        failed: number[];
    }>;
    /**
     * Reads an SMS message by its index.
     *
     * @param id The index of the SMS message to be read.
     * @param prio Whether this action should be prioritised in the command queue.
     *
     * @returns A promise that resolves with the parsed SMS message.
     */
    readSmsById(id: number, prio?: boolean): Promise<PduSms>;
    /**
     * Retrieves the SMS inbox from the SIM card.
     * It constructs an array of PduSms objects representing the messages in the inbox.
     * If message concatenation is enabled, it combines concatenated messages into a single PduSms object.
     *
     * @param prio Whether this action should be prioritised in the command queue.
     * @returns A promise that resolves with an array of PduSms objects representing SMS messages in the inbox.
     */
    getSimInbox(prio?: boolean): Promise<PduSms[]>;
    on<T extends keyof EventTypes>(eventName: T, listener: EventTypes[T]): void;
    once<T extends keyof EventTypes>(eventName: T, listener: EventTypes[T]): void;
    removeListener(eventName: keyof EventTypes, listener: (...args: unknown[]) => void): void;
}
