import { Event } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { EventHandler } from "./EventHandler.js";

export class SimpleBus implements EventBus {

    private handlers = new Map<string, EventHandler[]>();
    private channel: BroadcastChannel;

    constructor() {
        this.channel = new BroadcastChannel('nextcloud')
        
        console.debug('SimpleBus 2 created', this)
        // Global broadcast channel
        this.channel.onmessage = (event) => {
            (this.handlers.get(event.data.name) || []).forEach(h => {
                try {
                    h(event.data.event)
                } catch (e) {
                    console.error('could not invoke event listener', e)
                }
            })
        }
    }

    getVersion(): string {
      return globalThis.__pkg_version;
    }

    subscribe(name: string, handler: EventHandler): void {
        this.handlers.set(name, (this.handlers.get(name) || []).concat(handler));
    }

    unsubscribe(name: string, handler: EventHandler): void {
        this.handlers.set(name, (this.handlers.get(name) || []).filter(h => h != handler));
    }

    emit(name: string, event: Event): void {
        try {
            const data = { name, event }
            console.debug('Bus emit', data);
            this.channel.postMessage(data);
        } catch (e) {
            console.error('could not emit event', e)
        }
    }
}
