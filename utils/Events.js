"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const events_1 = require("events");
class Events extends events_1.EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
    }
    emit(event, ...parameters) {
        return super.emit(event, ...parameters);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
}
exports.Events = Events;
//# sourceMappingURL=Events.js.map