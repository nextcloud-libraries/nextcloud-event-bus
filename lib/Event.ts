export type Event = object | number | string | boolean | null | undefined

/**
 * Generic events mapping, fallback if no explicit types events are defined
 * @see NextcloudEvents
 */
export type GenericEvents = Record<string | symbol, Event>

/**
 * Nextcloud EventBus events
 * This can be extended to allow typing of events like:
 * @example
 * ```ts
 * // event-bus.d.ts
 * // Extend the Nextcloud events interface for your custom event
 * declare module '@nextcloud/event-bus' {
 *     export interface NextcloudEvents {
 *         // mapping of 'event name' => 'event type'
 *         'my-event': { foo: number, bar: boolean }
 *     }
 * }
 * export {}
 *
 * // your-code.ts
 * import { emit } from '@nextcloud/event-bus'
 * // Here the type of 'params' is infered automatically
 * emit('my-event', (params) => { console.debug(params.foo, params.bar) })
 * ```
 */
export interface NextcloudEvents {
	[eventName: string | symbol]: Event
}
