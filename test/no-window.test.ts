/**
 * @jest-environment node
 */

import { afterAll, beforeEach, describe, expect, jest, test } from "@jest/globals"

describe('Handle no window', () => {
    const consoleError = jest.spyOn(console, 'error')
    const consoleWarn = jest.spyOn(console, 'warn')

    afterAll(() => {
        jest.restoreAllMocks()
    })
    beforeEach(() => {
        // @ts-ignore
        global.window = undefined
        consoleError.mockReset()
        consoleWarn.mockReset()

        // reset modules to invalidate the local bus variable
        jest.resetModules()
    })

    test('No window available', async () => {
        const { subscribe } = await import("../lib")

        const cb = jest.fn()
        subscribe('test', cb)
        expect(consoleError).toHaveBeenCalledTimes(1)
        expect(consoleError.mock.calls[0][0]).toMatch(/Window not available/)
    })

    test('No bus on window available', async () => {
        // @ts-ignore
        global.window = { }

        const { subscribe, SimpleBus } = await import("../lib")

        const cb = jest.fn()
        subscribe('test', cb)
        // new bus is created
        expect(global.window?._nc_event_bus instanceof SimpleBus).toBe(true)
    })

    test('Old OC eventbus', async () => {
        consoleWarn.mockImplementation(() => {})

        const oldBus = { subscribe: jest.fn(), emit: jest.fn() }
        // @ts-ignore
        global.window = { OC: { _eventBus: oldBus }}

        const { emit, subscribe } = await import("../lib")

        subscribe('test', jest.fn())
        expect(consoleWarn).toHaveBeenCalled()
        expect(consoleWarn.mock.calls[0][0]).toMatch(/old event bus instance at OC\._eventBus/)
        // old bus set to new bus variable
        expect(global.window?._nc_event_bus).toBe(oldBus)
        // subscribed to old bus
        expect(oldBus.subscribe).toBeCalledTimes(1)

        emit('test', { txt: 'hello' })
        expect(oldBus.emit).toBeCalledTimes(1)
    })
})