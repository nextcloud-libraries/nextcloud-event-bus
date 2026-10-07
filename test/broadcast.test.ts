/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { afterEach, beforeEach, expect, test, vi } from 'vitest'

declare global {
	interface Window {
		_oc_webroot?: string
	}
}

const channelName = 'nextcloud:event-bus:v1:/nextcloud'
let otherTab: BroadcastChannel

/**
 * Load a fresh copy of the package, like another app bundling it
 */
async function loadPackage() {
	vi.resetModules()
	return await import('../lib/index.ts')
}

/**
 * Collect what another tab of the same instance receives
 *
 * @param channel - The channel of the other tab
 */
function listen(channel = otherTab) {
	const received: unknown[] = []
	channel.addEventListener('message', ({ data }) => received.push(data))
	return received
}

/**
 * Give the channels time to deliver
 */
function settle() {
	return new Promise((resolve) => setTimeout(resolve, 50))
}

beforeEach(() => {
	document.head.setAttribute('data-user', 'alice')
	window._oc_webroot = '/nextcloud'
	otherTab = new BroadcastChannel(channelName)
})

afterEach(() => {
	otherTab.close()
	window._nc_event_bus_channel_v1?.close()
	delete window._nc_event_bus_channel_v1
	delete window._nc_event_bus
	delete window._oc_webroot
	document.head.removeAttribute('data-user')
	vi.restoreAllMocks()
})

test('broadcast reaches the other tabs but not the current one', async () => {
	const { broadcast, subscribe } = await loadPackage()
	const received = listen()
	const handler = vi.fn()

	subscribe('files:node:updated', handler)
	broadcast('files:node:updated', { fileid: 42 })

	await vi.waitFor(() => expect(received).toEqual([{ version: 1, name: 'files:node:updated', event: { fileid: 42 } }]))
	expect(handler).not.toHaveBeenCalled()
})

test('emit stays in the tab', async () => {
	const { emit, subscribe } = await loadPackage()
	const received = listen()
	const handler = vi.fn()

	subscribe('files:node:updated', handler)
	emit('files:node:updated', { fileid: 42 })
	await settle()

	expect(handler).toHaveBeenCalledOnce()
	expect(received).toEqual([])
})

test('events from other tabs reach the subscribers', async () => {
	const { subscribe } = await loadPackage()
	const handler = vi.fn()

	subscribe('files:node:updated', handler)
	otherTab.postMessage({ version: 1, name: 'files:node:updated', event: { fileid: 42 } })

	await vi.waitFor(() => expect(handler).toHaveBeenCalledExactlyOnceWith({ fileid: 42 }))
})

test('events from other tabs are emitted once with several copies of the package', async () => {
	const first = await loadPackage()
	const second = await loadPackage()
	const handler = vi.fn()

	first.subscribe('files:node:updated', handler)
	second.subscribe('files:node:updated', vi.fn())
	otherTab.postMessage({ version: 1, name: 'files:node:updated', event: { fileid: 42 } })

	await vi.waitFor(() => expect(handler).toHaveBeenCalledOnce())
	await settle()
	expect(handler).toHaveBeenCalledOnce()
})

test('the channel is stored under a versioned global', async () => {
	const { subscribe } = await loadPackage()

	subscribe('files:node:updated', vi.fn())

	expect(window._nc_event_bus_channel_v1).toBeInstanceOf(BroadcastChannel)
})

test('unknown messages are ignored', async () => {
	const { subscribe } = await loadPackage()
	const handler = vi.fn()

	subscribe('files:node:updated', handler)
	otherTab.postMessage({ version: 2, name: 'files:node:updated', event: {} })
	otherTab.postMessage('files:node:updated')
	await settle()

	expect(handler).not.toHaveBeenCalled()
})

test('another instance on the same origin does not receive the events', async () => {
	const { broadcast } = await loadPackage()
	const otherInstance = new BroadcastChannel('nextcloud:event-bus:v1:/other')
	const received = listen(otherInstance)

	broadcast('files:node:updated', { fileid: 42 })
	await settle()
	otherInstance.close()

	expect(received).toEqual([])
})

test('public pages do not broadcast', async () => {
	document.head.removeAttribute('data-user')
	const { broadcast } = await loadPackage()
	const received = listen()

	broadcast('files:node:updated', { fileid: 42 })
	await settle()

	expect(received).toEqual([])
	expect(window._nc_event_bus_channel_v1).toBeNull()
})

test('a payload that cannot be cloned is not sent', async () => {
	const { broadcast } = await loadPackage()
	const received = listen()
	const error = vi.spyOn(console, 'error').mockImplementation(() => {})

	broadcast('files:node:updated', { callback: () => {} })
	await settle()

	expect(received).toEqual([])
	expect(error).toHaveBeenCalledWith(expect.stringContaining('toJSON()'), expect.anything())
})

test('a string payload reaches the other tabs as is', async () => {
	const { broadcast } = await loadPackage()
	const received = listen()

	broadcast('foo', 'bar')

	await vi.waitFor(() => expect(received).toEqual([{ version: 1, name: 'foo', event: 'bar' }]))
})
