import { emit, subscribe, unsubscribe } from '../lib'
import { expect, jest, test } from '@jest/globals'

test('readme example', () => {
    const h = jest.fn()

    subscribe('a', h)
    subscribe('b', h)
    emit('a', {
        data: 123,
    })
    unsubscribe('a', h)
    unsubscribe('b', h)

    expect(h.mock.calls.length).toBe(1)
})

test('subscribe and unsubscribe', () => {
    const h = jest.fn()

    subscribe('a', h)
    emit('a', {
        data: 123,
    })
    unsubscribe('a', h)
    emit('a', {
        data: 123,
    })

    expect(h.mock.calls.length).toBe(1)
})

test('exports', async () => {
    const ex = await import('../lib/index')

    expect(Object.keys(ex)).toEqual(expect.arrayContaining([
        'subscribe',
        'unsubscribe',
        'SimpleBus',
        'ProxyBus'
    ]))

    try {
        const simple = new ex.SimpleBus()
        new ex.ProxyBus(simple)
        expect('No errors').toBe('No errors')
    } catch (e) {
        expect(e).toBe('Unexpected error')
    }
})
