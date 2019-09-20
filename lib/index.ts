import { EventBus } from "./EventBus";
import { ProxyBus } from "./ProxyBus";
import { SimpleBus } from "./SimpleBus";

declare var OC: any;

function getBus(): EventBus {
    // Either use an existing event bus instance or create one
    if (OC && OC._eventBus) {
        return new ProxyBus(OC._eventBus)
    } else if (OC) {
        return OC._eventBus = new SimpleBus()
    } else {
        console.warn('no global OC found, creating a local event bus')
        return new SimpleBus()
    }
}

const bus = getBus();

export const subscribe = bus.subscribe
export const unsubscribe = bus.unsubscribe
export const emit = bus.emit
