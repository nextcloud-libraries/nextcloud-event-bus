/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { GenericEvents, NextcloudEvents } from './Event.js'
import type { EventBus } from './EventBus.js'
import type { EventHandler } from './EventHandler.js'
import type { IsUndefined } from './types.ts'

export class SimpleBus<E extends GenericEvents = NextcloudEvents>
	implements EventBus<E>
{
	private handlers = new Map<keyof E, EventHandler<E[keyof E]>[]>()

	getVersion(): string {
		return __pkg_version
	}

	subscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	): void {
		this.handlers.set(
			name,
			(this.handlers.get(name) || []).concat(
				handler as EventHandler<E[keyof E]>,
			),
		)
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
		const handlers = this.handlers.get(name) || []
		handlers.forEach((h) => {
			try {
				;(h as EventHandler<(typeof event)[0]>)(event[0])
			} catch (e) {
				console.error('could not invoke event listener', e)
			}
		})
	}
}
