/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { Event } from './Event'

export interface EventHandler<T extends Event> {
	(event: T): void
}
