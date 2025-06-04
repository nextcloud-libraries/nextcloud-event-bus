/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Helper to check if a type is undefined
 */
export type IsUndefined<T> = [T] extends [undefined] ? true : false
