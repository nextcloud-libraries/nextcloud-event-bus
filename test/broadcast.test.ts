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
	delete window._nc_event_bus_deserializers_v1
	delete window._nc_event_bus
	delete window._oc_webroot
	document.head.removeAttribute('data-user')
	vi.restoreAllMocks()
})

test('broadcast reaches the current tab and the other tabs', async () => {
	const { broadcast, subscribe } = await loadPackage()
	const received = listen()
	const handler = vi.fn()

	subscribe('files:node:updated', handler)
	broadcast('files:node:updated', { fileid: 42 })

	expect(handler).toHaveBeenCalledExactlyOnceWith({ fileid: 42 })
	await vi.waitFor(() => expect(received).toEqual([{ version: 1, name: 'files:node:updated', event: { fileid: 42 }, serialized: false }]))
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
	otherTab.postMessage({ version: 1, name: 'files:node:updated', event: { fileid: 42 }, serialized: false })

	await vi.waitFor(() => expect(handler).toHaveBeenCalledExactlyOnceWith({ fileid: 42 }))
})

test('events from other tabs are emitted once with several copies of the package', async () => {
	const first = await loadPackage()
	const second = await loadPackage()
	const handler = vi.fn()

	first.subscribe('files:node:updated', handler)
	second.subscribe('files:node:updated', vi.fn())
	otherTab.postMessage({ version: 1, name: 'files:node:updated', event: { fileid: 42 }, serialized: false })

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
	otherTab.postMessage({ version: 2, name: 'files:node:updated', event: {}, serialized: false })
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

test('public pages still emit in the current tab', async () => {
	document.head.removeAttribute('data-user')
	const { broadcast, subscribe } = await loadPackage()
	const handler = vi.fn()

	subscribe('files:node:updated', handler)
	broadcast('files:node:updated', { fileid: 42 })

	expect(handler).toHaveBeenCalledExactlyOnceWith({ fileid: 42 })
})

test('a payload that cannot be cloned is not sent', async () => {
	const { broadcast } = await loadPackage()
	const received = listen()
	const error = vi.spyOn(console, 'error').mockImplementation(() => {})

	broadcast('files:node:updated', { callback: () => {} })
	await settle()

	expect(received).toEqual([])
	expect(error).toHaveBeenCalledWith(expect.stringContaining('serialize option'), expect.anything())
})

test('other broadcast errors are logged without the payload hint', async () => {
	const { broadcast } = await loadPackage()
	const error = vi.spyOn(console, 'error').mockImplementation(() => {})
	broadcast('files:node:updated', { fileid: 41 })
	// Posting on a closed channel fails with an InvalidStateError
	window._nc_event_bus_channel_v1!.close()

	broadcast('files:node:updated', { fileid: 42 })

	expect(error).toHaveBeenCalledWith('could not broadcast the event to other tabs', expect.objectContaining({ name: 'InvalidStateError' }))
	expect(error).not.toHaveBeenCalledWith(expect.stringContaining('serialize option'), expect.anything())
})

test('a string payload reaches the other tabs as is', async () => {
	const { broadcast } = await loadPackage()
	const received = listen()

	broadcast('foo', 'bar')

	await vi.waitFor(() => expect(received).toEqual([{ version: 1, name: 'foo', event: 'bar', serialized: false }]))
})

/**
 * A class instance that cannot be cloned as is, like the nodes of `@nextcloud/files`
 */
class Item {
	constructor(public readonly id: number, public readonly load: () => void = () => {}) {}

	toJSON(): string {
		return JSON.stringify({ id: this.id })
	}

	static fromJSON(json: unknown): Item {
		return new Item(JSON.parse(json as string).id)
	}
}

test('serialize sends the serialized payload, the current tab keeps the original', async () => {
	const { broadcast, subscribe } = await loadPackage()
	const received = listen()
	const handler = vi.fn()
	const item = new Item(42)

	subscribe('foo', handler)
	broadcast('foo', item, { serialize: (event) => (event as Item).toJSON() })

	expect(handler).toHaveBeenCalledExactlyOnceWith(item)
	await vi.waitFor(() => expect(received).toEqual([{ version: 1, name: 'foo', event: '{"id":42}', serialized: true }]))
})

test('a serialized event from another tab goes through its deserializer', async () => {
	const { registerBroadcastDeserializer, subscribe } = await loadPackage()
	const handler = vi.fn()

	registerBroadcastDeserializer('foo', Item.fromJSON)
	subscribe('foo', handler)
	otherTab.postMessage({ version: 1, name: 'foo', event: '{"id":42}', serialized: true })

	await vi.waitFor(() => expect(handler).toHaveBeenCalledOnce())
	expect(handler.mock.calls[0]![0]).toBeInstanceOf(Item)
	expect(handler.mock.calls[0]![0].id).toBe(42)
})

test('deserializers are shared by the copies of the package', async () => {
	const first = await loadPackage()
	const second = await loadPackage()
	const handler = vi.fn()

	second.registerBroadcastDeserializer('foo', Item.fromJSON)
	first.subscribe('foo', handler)
	otherTab.postMessage({ version: 1, name: 'foo', event: '{"id":42}', serialized: true })

	await vi.waitFor(() => expect(handler).toHaveBeenCalledOnce())
	expect(handler.mock.calls[0]![0]).toBeInstanceOf(Item)
})

test('a serialized event without deserializer in this tab is dropped', async () => {
	const { subscribe } = await loadPackage()
	const handler = vi.fn()
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

	subscribe('foo', handler)
	otherTab.postMessage({ version: 1, name: 'foo', event: '{"id":42}', serialized: true })

	await vi.waitFor(() => expect(warn).toHaveBeenCalledOnce())
	expect(handler).not.toHaveBeenCalled()
})

test('a serialized event that fails to deserialize is dropped', async () => {
	const { registerBroadcastDeserializer, subscribe } = await loadPackage()
	const handler = vi.fn()
	const error = vi.spyOn(console, 'error').mockImplementation(() => {})

	registerBroadcastDeserializer('foo', Item.fromJSON)
	subscribe('foo', handler)
	otherTab.postMessage({ version: 1, name: 'foo', event: 'not json', serialized: true })

	await vi.waitFor(() => expect(error).toHaveBeenCalledWith('could not deserialize the broadcast event foo', expect.any(SyntaxError)))
	expect(handler).not.toHaveBeenCalled()
})

test('a payload that fails to serialize is only emitted in the current tab', async () => {
	const { broadcast, subscribe } = await loadPackage()
	const received = listen()
	const handler = vi.fn()
	const error = vi.spyOn(console, 'error').mockImplementation(() => {})

	subscribe('foo', handler)
	broadcast('foo', new Item(42), { serialize: () => {
		throw new Error('nope')
	} })
	await settle()

	expect(handler).toHaveBeenCalledOnce()
	expect(received).toEqual([])
	expect(error).toHaveBeenCalledWith('could not serialize the event foo for the other tabs', expect.any(Error))
})
