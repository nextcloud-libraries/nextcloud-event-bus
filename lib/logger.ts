/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getLoggerBuilder } from '@nextcloud/logger'

export const logger = getLoggerBuilder()
	.setApp('@nextcloud/event-bus')
	.build()
