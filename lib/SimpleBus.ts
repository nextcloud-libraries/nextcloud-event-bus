import { GenericEvents, NextcloudEvents } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { EventHandler } from "./EventHandler.js";

export class SimpleBus<E extends GenericEvents = NextcloudEvents> implements EventBus<E> {

    private handlers = new Map<keyof E, EventHandler<E[keyof E]>[]>();

    getVersion(): string {
      return __pkg_version;
    }

    subscribe<EventName extends keyof E>(name: EventName, handler: EventHandler<E[EventName]>): void {
        this.handlers.set(name, (this.handlers.get(name) || []).concat(handler as EventHandler<E[keyof E]>));
    }

    unsubscribe<EventName extends keyof E>(name: EventName, handler: EventHandler<E[EventName]>): void {
        this.handlers.set(name, (this.handlers.get(name) || []).filter(h => h !== handler));
    }

    emit<EventName extends keyof E>(name: EventName, event: E[EventName]): void {
        (this.handlers.get(name) || []).forEach(h => {
            try {
                h(event)
            } catch (e) {
                console.error('could not invoke event listener', e)
            }
        })
    }

}
