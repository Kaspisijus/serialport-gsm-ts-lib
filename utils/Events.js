"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const events_1 = require("events");
class Events extends events_1.EventEmitter {
    constructor(logger) {
        super();
        this.logger = logger;
        this.setMaxListeners(50);
    }
    emit(event, ...parameters) {
        return super.emit(event, ...parameters);
    }
    on(event, listener) {
        this.logger?.log(`${event} listener added. total: ${this.listenerCount(event)}`);
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    removeListener(eventName, listener) {
        this.logger?.log(`${String(eventName)} listener removed. total: ${this.listenerCount(String(eventName))}`);
        return super.removeListener(eventName, listener);
    }
}
exports.Events = Events;
//# sourceMappingURL=Events.js.map