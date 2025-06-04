/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { GenericEvents, NextcloudEvents } from './Event.ts'
import type { EventHandler } from './EventHandler.ts'
import type { IsUndefined } from './types.ts'

export interface EventBus<E extends GenericEvents = NextcloudEvents> {
	/**
	 * Get the version of this event bus instance
	 * This is used for compatibility checking
	 */
	getVersion(): string

	/**
	 * Subscribe the event bus
	 *
	 * @param name Name of the event to subscribe
	 * @param handler Handler invoked when receiving the event
	 */
	subscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	): void

	/**
	 * Unsubscribe a handler on one event from the event bus
	 *
	 * @param name Name of the event to unsubscribe
	 * @param handler Handler to unsubscribe
	 */
	unsubscribe<EventName extends keyof E>(
		name: EventName,
		handler: EventHandler<E[EventName]>,
	): void

	/**
	 * Emit an event on the event bus
	 *
	 * @param name Name of the event to emit
	 * @param event Event payload to emit
	 */
	emit<EventName extends keyof E>(
		name: EventName,
		...event: IsUndefined<E[EventName]> extends true ? [] : [E[EventName]]
	): void
}
