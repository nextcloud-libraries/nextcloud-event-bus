import valid from "semver/functions/valid.js";
import major from "semver/functions/major.js";

import type { Event, GenericEvents, NextcloudEvents } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { EventHandler } from "./EventHandler.js";

export class ProxyBus<E extends GenericEvents = NextcloudEvents> implements EventBus<E> {

    private bus: EventBus<E>;

    constructor(bus: EventBus<E>) {
        if (typeof bus.getVersion !== 'function' || !valid(bus.getVersion())) {
            console.warn('Proxying an event bus with an unknown or invalid version')
        } else if (major(bus.getVersion()) !== major(this.getVersion())) {
            console.warn('Proxying an event bus of version ' + bus.getVersion() + ' with ' + this.getVersion())
        }

        this.bus = bus;
    }

    getVersion(): string {
        return globalThis.__pkg_version;
    }

    subscribe<EventName extends keyof E>(name: EventName, handler: EventHandler<E[EventName]>): void {
        this.bus.subscribe(name, handler);
    }

    unsubscribe<EventName extends keyof E>(name: EventName, handler: EventHandler<E[EventName]>): void {
        this.bus.unsubscribe(name, handler);
    }

    emit<EventName extends keyof E>(name: EventName, event: E[EventName]): void {
        this.bus.emit(name, event);
    }

}
