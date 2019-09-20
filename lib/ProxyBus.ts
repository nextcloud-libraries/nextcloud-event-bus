import packageJson from "../package.json";
import { Event } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { EventHandler } from "./EventHandler.js";

export class ProxyBus implements EventBus {

    private bus: EventBus;

    constructor(bus: EventBus) {
        if (bus.getVersion() !== this.getVersion()) {
            // TODO: only warn if major version number does not match
            console.warn('Proxying an event bus of version ' + bus.getVersion() + ' with ' + this.getVersion())
        }

        this.bus = bus;
    }

    getVersion(): string {
        return packageJson.version
    }

    subscribe(name: string, handler: EventHandler): void {
        this.bus.subscribe(name, handler);
    }

    unsubscribe(name: string, handler: EventHandler): void {
        this.bus.unsubscribe(name, handler);
    }

    emit(event: Event): void {
        this.bus.emit(event);
    }

}
