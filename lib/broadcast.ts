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
	event: unknown
	/** Whether `event` went through the `serialize` option of `broadcast()` */
	serialized: boolean
}

/**
 * Turns the serialized payload of an event back into what its subscribers expect
 */
export type BroadcastDeserializer = (data: unknown) => Event

/**
 * The deserializers by event name, shared by every copy of this package on the page
 */
function getDeserializers(): Map<string, BroadcastDeserializer> {
	window._nc_event_bus_deserializers_v1 ??= new Map()
	return window._nc_event_bus_deserializers_v1
}

/**
 * Register how to rebuild the payload of an event that is broadcast with a `serialize` option
 *
 * @param name - Name of the event
 * @param deserialize - Turns the serialized payload back into the event payload
 */
export function registerBroadcastDeserializer(name: string, deserialize: BroadcastDeserializer): void {
	getDeserializers().set(name, deserialize)
}

/**
 * Emit an event received from another tab, deserializing its payload when needed
 *
 * @param bus - The event bus of this tab
 * @param message - The message received
 */
function emitReceived(bus: EventBus, message: BroadcastMessage): void {
	if (!message.serialized) {
		bus.emit(message.name, message.event as Event)
		return
	}

	const deserialize = getDeserializers().get(message.name)
	if (deserialize === undefined) {
		console.warn(`dropped the broadcast event ${message.name}: no deserializer registered for it in this tab`)
		return
	}

	let event: Event
	try {
		event = deserialize(message.event)
	} catch (error) {
		console.error(`could not deserialize the broadcast event ${message.name}`, error)
		return
	}
	bus.emit(message.name, event)
}

/**
 * @param data - Data received on the channel
 */
function isBroadcastMessage(data: unknown): data is BroadcastMessage {
	return typeof data === 'object'
		&& data !== null
		&& (data as BroadcastMessage).version === PROTOCOL_VERSION
		&& typeof (data as BroadcastMessage).name === 'string'
		&& typeof (data as BroadcastMessage).serialized === 'boolean'
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
 * The global and the channel name carry the protocol version: a copy with a
 * different message format opens its own channel instead of sharing this one.
 *
 * @param bus - The event bus to emit received events on
 */
export function setupBroadcastChannel(bus: EventBus): BroadcastChannel | null {
	if (window._nc_event_bus_channel_v1 !== undefined) {
		return window._nc_event_bus_channel_v1
	}

	let channel: BroadcastChannel | null = null
	if (isUserLoggedIn() && typeof BroadcastChannel !== 'undefined') {
		channel = new BroadcastChannel(`nextcloud:event-bus:v${PROTOCOL_VERSION}:${getRootUrl()}`)
		channel.addEventListener('message', ({ data }: MessageEvent) => {
			if (isBroadcastMessage(data)) {
				emitReceived(bus, data)
			}
		})
	}

	window._nc_event_bus_channel_v1 = channel
	return channel
}

/**
 * Send an event to the other tabs
 *
 * @param channel - The channel of this tab
 * @param name - Name of the event
 * @param event - Event payload, structured cloneable unless `serialize` is given
 * @param serialize - Turns the payload into structured cloneable data
 */
export function postBroadcast(channel: BroadcastChannel, name: string, event: Event, serialize?: (event: Event) => unknown): void {
	let data: unknown = event
	if (serialize !== undefined) {
		try {
			data = serialize(event)
		} catch (error) {
			console.error(`could not serialize the event ${name} for the other tabs`, error)
			return
		}
	}

	try {
		channel.postMessage({ version: PROTOCOL_VERSION, name, event: data, serialized: serialize !== undefined } satisfies BroadcastMessage)
	} catch (error) {
		// Checked by name: the DOMException class can differ between realms
		if ((error as { name?: unknown } | null)?.name === 'DataCloneError') {
			console.error('could not broadcast the event to other tabs, the payload must be plain data, or use the serialize option', error)
			return
		}
		console.error('could not broadcast the event to other tabs', error)
	}
}
