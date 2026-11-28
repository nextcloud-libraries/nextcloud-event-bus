/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { NextcloudEvents } from './Event.ts'
import type { EventBus } from './EventBus.ts'
import type { EventHandler } from './EventHandler.ts'
import type { IsUndefined } from './types.ts'

import { postBroadcast, setupBroadcastChannel } from './broadcast.ts'

export type { BroadcastDeserializer } from './broadcast.ts'
export { registerBroadcastDeserializer } from './broadcast.ts'
import { ProxyBus } from './ProxyBus.ts'
import { SimpleBus } from './SimpleBus.ts'

export type { EventBus } from './EventBus.ts'
export type { EventHandler } from './EventHandler.ts'
export type { Event, NextcloudEvents } from './Event.ts'

export { ProxyBus } from './ProxyBus.ts'
export { SimpleBus } from './SimpleBus.ts'

let bus: EventBus | null = null

/**
 * Get the event bus
 * If a bus was already created by an other app a proxy bus is returned
 * otherwise a new bus is created and registered globally
 */
function getBus(): EventBus {
	if (bus !== null) {
		return bus
	}

	if (typeof window === 'undefined') {
		// testing or SSR
		return new Proxy({} as EventBus, {
			get: () => {
				return () => console.error('Window not available, EventBus can not be established!')
			},
		})
	}

	if (window.OC?._eventBus && typeof window._nc_event_bus === 'undefined') {
		console.warn('found old event bus instance at OC._eventBus. Update your version!')
		window._nc_event_bus = window.OC._eventBus
	}

	// Either use an existing event bus instance or create one
	if (typeof window?._nc_event_bus !== 'undefined') {
		bus = new ProxyBus(window._nc_event_bus)
	} else {
		bus = window._nc_event_bus = new SimpleBus()
	}
	setupBroadcastChannel(bus)
	return bus
}

/**
 * Register an event listener
 *
 * @param name name of the event
 * @param handler callback invoked for every matching event emitted on the bus
 */
export function subscribe<K extends keyof NextcloudEvents>(
	name: K,
	handler: EventHandler<NextcloudEvents[K]>,
): void {
	getBus().subscribe(name, handler)
}

/**
 * Unregister a previously registered event listener
 *
 * Note: doesn't work with anonymous functions (closures). Use method of an object or store listener function in variable.
 *
 * @param name name of the event
 * @param handler callback passed to `subscribed`
 */
export function unsubscribe<K extends keyof NextcloudEvents>(
	name: K,
	handler: EventHandler<NextcloudEvents[K]>,
): void {
	getBus().unsubscribe(name, handler)
}

/**
 * Emit an event
 *
 * @param name name of the event
 * @param event event payload
 */
export function emit<K extends keyof NextcloudEvents>(
	name: K,
	...event: IsUndefined<NextcloudEvents[K]> extends true
		? []
		: [NextcloudEvents[K]]
): void {
	getBus().emit(name, ...event)
}

/**
 * Options of `broadcast()`
 */
export interface BroadcastOptions<T> {
	/**
	 * Turn the payload into structured cloneable data for the other tabs, e.g. `(node) => node.toJSON()`.
	 * The tabs receiving it need a deserializer registered with `registerBroadcastDeserializer()`.
	 * Subscribers in the current tab still get the original payload.
	 */
	serialize?: (event: T) => unknown
}

/**
 * Emit an event in this tab and in the other tabs of this Nextcloud instance.
 * On public pages it is only emitted in this tab.
 *
 * Other tabs receive a copy made with the structured clone algorithm: plain data, class
 * instances lose their prototype. Use the `serialize` option for payloads that cannot be cloned.
 *
 * @param name Name of the event to broadcast
 * @param args Event payload, and the broadcast options
 */
export function broadcast<K extends keyof NextcloudEvents & string>(
	name: K,
	...args: IsUndefined<NextcloudEvents[K]> extends true
		? []
		: [NextcloudEvents[K], BroadcastOptions<NextcloudEvents[K]>?]
): void {
	const [event, options] = args as [NextcloudEvents[K]?, BroadcastOptions<NextcloudEvents[K]>?]
	// Also opens the channel of this tab on first use
	emit(name, ...(args.slice(0, 1) as IsUndefined<NextcloudEvents[K]> extends true ? [] : [NextcloudEvents[K]]))

	const channel = typeof window === 'undefined' ? null : window._nc_event_bus_channel_v1
	if (channel) {
		postBroadcast(channel, name, event, options?.serialize as ((event: unknown) => unknown) | undefined)
	}
}
