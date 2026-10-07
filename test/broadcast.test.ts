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

const channelName = 'nextcloud:event-bus:/nextcloud'
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

/**
 * A class instance that cannot be structured-cloned, like `@nextcloud/files` nodes
 */
class Item {
	attributes: Record<string, unknown>

	constructor(public id: number, attributes: Record<string, unknown>) {
		this.attributes = new Proxy(attributes, {})
	}

	toJSON(): string {
		return JSON.stringify([this.id, { ...this.attributes }])
	}

	static fromJSON(json: string): Item {
		return new Item(...(JSON.parse(json) as [number, Record<string, unknown>]))
	}
}

beforeEach(() => {
	document.head.setAttribute('data-user', 'alice')
	window._oc_webroot = '/nextcloud'
	otherTab = new BroadcastChannel(channelName)
})

afterEach(() => {
	otherTab.close()
	window._nc_event_bus_channel?.channel?.close()
	delete window._nc_event_bus_channel
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

test('the channel owner is stored with its version', async () => {
	const { subscribe } = await loadPackage()

	subscribe('files:node:updated', vi.fn())

	expect(window._nc_event_bus_channel).toEqual({ version: expect.any(String), channel: expect.any(BroadcastChannel) })
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
	const otherInstance = new BroadcastChannel('nextcloud:event-bus:/other')
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
	expect(window._nc_event_bus_channel).toEqual({ version: expect.any(String), channel: null })
})

test('a payload that cannot be cloned is not sent', async () => {
	const { broadcast } = await loadPackage()
	const received = listen()
	const error = vi.spyOn(console, 'error').mockImplementation(() => {})

	broadcast('files:node:updated', new Item(42, { favorite: 1 }))
	await settle()

	expect(received).toEqual([])
	expect(error).toHaveBeenCalledWith(expect.stringContaining('toJSON()'), expect.anything())
})

test('a payload serialized with toJSON() can be rebuilt in the other tab', async () => {
	const { broadcast } = await loadPackage()
	const received: string[] = []
	otherTab.addEventListener('message', ({ data }) => received.push(data.event))

	broadcast('files:node:updated', new Item(42, { favorite: 1, tags: ['a'] }).toJSON())

	await vi.waitFor(() => expect(received).toHaveLength(1))
	const item = Item.fromJSON(received[0]!)
	expect(item.id).toBe(42)
	expect({ ...item.attributes }).toEqual({ favorite: 1, tags: ['a'] })
})
