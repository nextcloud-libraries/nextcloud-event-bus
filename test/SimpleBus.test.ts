import { afterAll, afterEach, describe, expect, jest, test } from '@jest/globals'
import { SimpleBus } from '../lib/SimpleBus'

declare const __pkg_version: string

describe('SimpleBus', () => {
    const consoleError = jest.spyOn(window.console, 'error')

    afterAll(() => consoleError.mockRestore())
    afterEach(() => {
        // reset calls
        consoleError.mockReset()
    })

    test('getVersion', () => {
        const bus = new SimpleBus()

        expect(bus.getVersion()).toBe(__pkg_version)
    })

    test('subscribe and emit', () => {
        const cb = jest.fn()
        const bus = new SimpleBus()
        bus.subscribe('test', cb)
        bus.emit('test', 'the message')

        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenLastCalledWith('the message')
    })

    test('subscribe multiple', () => {
        const message = { text: 'Hello' }
        const cb = jest.fn()
        const cb2 = jest.fn()
        const bus = new SimpleBus()
        bus.subscribe('test', cb)
        bus.subscribe('test', cb2)
        bus.emit('test', message)

        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb2).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenLastCalledWith(message)
        expect(cb2).toHaveBeenLastCalledWith(message)
    })

    test('unsubscribe', () => {
        const cb = jest.fn()
        const bus = new SimpleBus()
        bus.subscribe('test', cb)
        bus.unsubscribe('test', cb)
        bus.emit('test', 'the message')

        expect(cb).toHaveBeenCalledTimes(0)
    })

    test('unsubscribe w/o subscribed', () => {
        const cb = jest.fn()
        const bus = new SimpleBus()
        try {
            bus.unsubscribe('test', cb)
            expect('no error').toBe('no error')
        } catch (e) {
            expect(e).toBe('not expected exception')
        }
    })

    test('unsubscribe partly', () => {
        const cb = jest.fn()
        const cb2 = jest.fn()
        const bus = new SimpleBus()
        bus.subscribe('test', cb)
        bus.subscribe('test', cb2)
        bus.unsubscribe('test', cb)
        bus.emit('test', 'the message')

        expect(cb).toHaveBeenCalledTimes(0)
        expect(cb2).toHaveBeenCalledTimes(1)
        expect(cb2).toHaveBeenCalledWith('the message')
    })

    test('emit without handler', () => {
        const bus = new SimpleBus()
        try {
            bus.emit('test', 'test message')
            expect('no error').toBe('no error')
        } catch (e) {
            expect(e).toBe('not expected exception')
        }
    })

    test('invalid emit', () => {
        consoleError.mockImplementation(() => {})
        const bus = new SimpleBus()
        const error = Error('invalid')
        bus.subscribe('test', () => { throw error })
        bus.emit('test', 'the message')

        expect(consoleError).toBeCalledTimes(1)
        expect(consoleError.mock.calls[0]?.[0]).toMatch(/could not invoke event listener/)
        expect(consoleError.mock.calls[0]?.[1]).toBe(error)
    })
})
