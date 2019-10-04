import { EventBus } from "./EventBus"
import { ProxyBus } from "./ProxyBus"
import { SimpleBus } from "./SimpleBus"

declare global {
    interface Window {
        OC: any
        _nc_event_bus: any
    }
}

function getBus(): EventBus {
    if ((typeof window.OC !== 'undefined') && window.OC._eventBus && typeof window._nc_event_bus === 'undefined') {
        console.warn('found old event bus instance at OC._eventBus. Update your version!')
        window._nc_event_bus = window.OC._eventBus
    }

    // Either use an existing event bus instance or create one
    if (typeof window._nc_event_bus !== 'undefined') {
        return new ProxyBus(window._nc_event_bus)
    } else {
        return window._nc_event_bus = new SimpleBus()
    }
}

const bus = getBus()

export const subscribe = bus.subscribe.bind(bus)
export const unsubscribe = bus.unsubscribe.bind(bus)
export const emit = bus.emit.bind(bus)
