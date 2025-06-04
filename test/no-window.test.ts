/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 *
 * @vitest-environment node
 */

import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

// just for the types
import '../lib/globals.d.ts'

describe('Handle no window', () => {
	const consoleError = vi.spyOn(console, 'error')
	const consoleWarn = vi.spyOn(console, 'warn')

	afterAll(() => {
		vi.restoreAllMocks()
	})
	beforeEach(() => {
		// @ts-expect-error Just for testing make sure there is no window
		globalThis.window = undefined
		consoleError.mockReset()
		consoleWarn.mockReset()

		// reset modules to invalidate the local bus variable
		vi.resetModules()
	})

	test('No window available', async () => {
		const { subscribe } = await import('../lib/index.ts')

		const cb = vi.fn()
		subscribe('test', cb)
		expect(consoleError).toHaveBeenCalledTimes(1)
		expect(consoleError.mock.calls[0][0]).toMatch(/Window not available/)
	})

	test('No bus on window available', async () => {
		// @ts-expect-error Just for testing make sure there is no window
		globalThis.window = {}

		const { subscribe, SimpleBus } = await import('../lib/index.ts')

		const cb = vi.fn()
		subscribe('test', cb)
		// new bus is created
		expect(globalThis.window?._nc_event_bus instanceof SimpleBus).toBe(true)
	})

	test('Old OC eventbus', async () => {
		consoleWarn.mockImplementation(() => {})

		const oldBus = { subscribe: vi.fn(), emit: vi.fn() }
		// @ts-expect-error Just for testing make sure there is no window
		globalThis.window = { OC: { _eventBus: oldBus } }

		const { emit, subscribe } = await import('../lib/index.ts')

		subscribe('test', vi.fn())
		expect(consoleWarn).toHaveBeenCalled()
		expect(consoleWarn.mock.calls[0][0]).toMatch(
			/old event bus instance at OC\._eventBus/,
		)
		// old bus set to new bus variable
		expect(globalThis.window?._nc_event_bus).toBe(oldBus)
		// subscribed to old bus
		expect(oldBus.subscribe).toBeCalledTimes(1)

		emit('test', { txt: 'hello' })
		expect(oldBus.emit).toBeCalledTimes(1)
	})
})
