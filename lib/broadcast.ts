/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { Event } from './Event.ts'
import type { EventBus } from './EventBus.ts'

import { getRootUrl } from '@nextcloud/router'

const PROTOCOL_VERSION = 1

interface BroadcastMessage {
	version: typeof PROTOCOL_VERSION
	name: string
	event: Event
}

/**
 * @param data - Data received on the channel
 */
function isBroadcastMessage(data: unknown): data is BroadcastMessage {
	return typeof data === 'object'
		&& data !== null
		&& (data as BroadcastMessage).version === PROTOCOL_VERSION
		&& typeof (data as BroadcastMessage).name === 'string'
}

/**
 * Whether a user is logged in, from the same `<head data-user>` source as
 * `getCurrentUser()`. `@nextcloud/auth` cannot be imported: it subscribes to
 * this package while loading, so with a deduplicated install it would call
 * `subscribe()` before this module is initialized.
 */
function isUserLoggedIn(): boolean {
	return typeof document !== 'undefined'
		&& Boolean(document.head?.getAttribute('data-user'))
}

/**
 * Open the channel shared by the tabs of this Nextcloud instance, once per tab.
 * `BroadcastChannel` is scoped per origin, the channel name adds the web root
 * as several instances can live on one origin. Public pages do not join it.
 *
 * Several copies of this package can be loaded on one page, the first one
 * owns the channel so every received event is emitted on the bus only once.
 *
 * @param bus - The event bus to emit received events on
 */
export function setupBroadcastChannel(bus: EventBus): BroadcastChannel | null {
	if (window._nc_event_bus_channel !== undefined) {
		return window._nc_event_bus_channel.channel
	}

	let channel: BroadcastChannel | null = null
	if (isUserLoggedIn() && typeof BroadcastChannel !== 'undefined') {
		channel = new BroadcastChannel(`nextcloud:event-bus:${getRootUrl()}`)
		channel.addEventListener('message', ({ data }: MessageEvent) => {
			if (isBroadcastMessage(data)) {
				bus.emit(data.name, data.event)
			}
		})
	}

	window._nc_event_bus_channel = { version: PACKAGE_VERSION, channel }
	return channel
}

/**
 * Send an event to the other tabs
 *
 * @param channel - The channel of this tab
 * @param name - Name of the event
 * @param event - Event payload, must be structured cloneable
 */
export function postBroadcast(channel: BroadcastChannel, name: string, event: Event): void {
	try {
		channel.postMessage({ version: PROTOCOL_VERSION, name, event } satisfies BroadcastMessage)
	} catch (error) {
		console.error('could not broadcast the event to other tabs, the payload must be plain data (e.g. the result of toJSON())', error)
	}
}
