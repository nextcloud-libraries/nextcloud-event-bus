import semver from "semver";

import packageJson from "../package.json";
import { Event } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { EventHandler } from "./EventHandler.js";

export class ProxyBus implements EventBus {

    private bus: EventBus;

    constructor(bus: EventBus) {
        if (typeof bus.getVersion !== 'function' || !semver.valid(bus.getVersion())) {
            console.warn('Proxying an event bus with an unknown or invalid version')
        } else if (semver.major(bus.getVersion()) !== semver.major(this.getVersion())) {
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

    emit(name: string, event: Event): void {
        this.bus.emit(name, event);
    }

}
