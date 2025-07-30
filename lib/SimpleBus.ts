/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { GenericEvents, NextcloudEvents } from './Event.js'
import type { EventBus } from './EventBus.js'
import type { EventHandler } from './EventHandler.js'
import type { IsUndefined } from './types.ts'
import { BroadcastChannel } from 'broadcast-channel'

type BroadcastMessage<E extends GenericEvents = NextcloudEvents> = {
	name: keyof E
	event: E[keyof E][] // or [E[keyof E]] if exactly one
}

export class SimpleBus<E extends GenericEvents = NextcloudEvents>
	implements EventBus<E>
{
	private handlers = new Map<keyof E, EventHandler<E[keyof E]>[]>()
	private globalHandlers = new Map<keyof E, EventHandler<E[keyof E]>[]>()
	private broadcastChannel: BroadcastChannel<BroadcastMessage<E>> | null = null

	constructor() {
		this.broadcastChannel = new BroadcastChannel('nextcloud')
		this.broadcastChannel.onmessage = ({ name, event }) => {
			const globalHandlers = this.globalHandlers.get(name) || []
			if (globalHandlers.length === 0) {
				console.debug(
					'No global bus handlers for event',
					name,
					'with data',
					event,
				)
				return
			}

			console.debug('Received bus broadcast message', { name, event })
			globalHandlers.forEach((h) => {
				try {
					;(h as EventHandler<(typeof event)[0]>)(event[0])
				} catch (e) {
					console.error('could not invoke global event listener', e)
				}
			})
		}
		console.debug('SimpleBus initialized with broadcast channel', this)
	}

	getVersion(): string {
		return __pkg_version
	}

	subscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
		global: boolean = false,
	): void {
		this.handlers.set(
			name,
			(this.handlers.get(name) || []).concat(
				handler as EventHandler<E[keyof E]>,
			),
		)

		// Also add to global handlers if requested
		if (global) {
			this.globalHandlers.set(
				name,
				(this.handlers.get(name) || []).filter((h) => h !== handler),
			)
		}
	}

	unsubscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	): void {
		this.handlers.set(
			name,
			(this.handlers.get(name) || []).filter((h) => h !== handler),
		)
	}

	emit<EventName extends keyof E>(
		name: EventName,
		...event: IsUndefined<E[EventName]> extends true ? [] : [E[EventName]]
	): void {
		// Local handlers first
		const handlers = this.handlers.get(name) || []
		handlers.forEach((h) => {
			try {
				;(h as EventHandler<(typeof event)[0]>)(event[0])
			} catch (e) {
				console.error('could not invoke event listener', e)
			}
		})

		// Then global handlers
		this.broadcastChannel?.postMessage({
			name,
			event,
		})
	}
}
