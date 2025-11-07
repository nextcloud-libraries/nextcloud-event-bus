/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { NextcloudEvents } from './Event.ts'
import type { EventBus } from './EventBus.ts'
import type { EventHandler } from './EventHandler.ts'
import type { IsUndefined } from './types.ts'

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
