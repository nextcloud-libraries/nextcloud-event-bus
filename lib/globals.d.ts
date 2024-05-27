/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { EventBus } from './EventBus.ts'

declare global {
	const __pkg_version: string

	interface Window {
		OC: {
			_eventBus?: EventBus
		}
		_nc_event_bus?: EventBus
	}
}

export {}
