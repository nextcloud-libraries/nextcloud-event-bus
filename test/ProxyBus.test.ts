/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import type { EventBus } from '../lib/EventBus'

import { afterAll, afterEach, describe, expect, vi, test } from 'vitest'
import { ProxyBus } from '../lib/ProxyBus'
import { SimpleBus } from '../lib/SimpleBus'

describe('ProxyBus', () => {
	const consoleWarn = vi.spyOn(window.console, 'warn')

	afterAll(() => consoleWarn.mockRestore())
	afterEach(() => {
		// reset calls
		consoleWarn.mockReset()
	})

	test('proxy invalid bus', () => {
		consoleWarn.mockImplementationOnce(() => {})
		const invalidBus = { emit: vi.fn() }
		// @ts-expect-error We want to test the interface for JS so disable type checking here
		const proxy = new ProxyBus(invalidBus as EventBus)

		// warn unknown version
		expect(consoleWarn).toBeCalledTimes(1)

		proxy.emit('test', 1)
		expect(invalidBus.emit).toBeCalledTimes(1)
	})

	test('proxy old bus', () => {
		consoleWarn.mockImplementationOnce(() => {})
		const emit = vi.fn()

		const bus = new ProxyBus({
			getVersion() {
				return '0.0.1'
			},
			emit,
			subscribe: vi.fn(() => {}),
			unsubscribe: vi.fn(() => {}),
		})
		bus.emit('test', { msg: 'hello' })

		// warning proxying old bus
		expect(consoleWarn).toBeCalledTimes(1)
		expect(emit).toHaveBeenCalled()
	})

	test('subscribe', () => {
		const cb = vi.fn()
		const bus = new SimpleBus()

		const proxyBus = new ProxyBus(bus)
		proxyBus.subscribe('aa', cb)
		proxyBus.emit('aa', 'the event')

		expect(cb).toHaveBeenCalledWith('the event')
	})

	test('unsubscribe', () => {
		const cb = vi.fn()
		const bus = new SimpleBus()

		const proxyBus = new ProxyBus(bus)
		proxyBus.subscribe('aa', cb)
		proxyBus.emit('aa', 'the event')
		proxyBus.unsubscribe('aa', cb)
		proxyBus.emit('aa', 'not the event')

		expect(cb).toHaveBeenCalledTimes(1)
		expect(cb).toHaveBeenCalledWith('the event')
	})

	test('proxy', () => {
		const cb = vi.fn()
		const bus = new SimpleBus()
		bus.subscribe('aa', cb)

		const proxyBus = new ProxyBus(bus)
		proxyBus.emit('aa', 'the event')

		expect(cb).toHaveBeenCalledWith('the event')
	})
})
