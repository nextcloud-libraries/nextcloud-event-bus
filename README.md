<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: CC0-1.0
-->

# @nextcloud/event-bus

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/nextcloud-event-bus)](https://api.reuse.software/info/github.com/nextcloud-libraries/nextcloud-event-bus)
[![Build Status](https://img.shields.io/github/actions/workflow/status/nextcloud/nextcloud-event-bus/node.yml?branch=master)](https://github.com/nextcloud/nextcloud-event-bus/actions/workflows/node.yml?query=branch%3Amaster) [![Code coverage](https://img.shields.io/codecov/c/gh/nextcloud/nextcloud-event-bus/master)](https://app.codecov.io/gh/nextcloud/nextcloud-event-bus) [![npm](https://img.shields.io/npm/v/@nextcloud/event-bus.svg)](https://www.npmjs.com/package/@nextcloud/event-bus)
[![Documentation](https://img.shields.io/badge/Documentation-online-brightgreen)](https://nextcloud.github.io/nextcloud-event-bus/)

A simple event bus to communicate between Nextcloud components.

## Installation

```sh
npm install @nextcloud/event-bus --save
```

```sh
yarn add @nextcloud/event-bus
```

## Usage

```js
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'

const h = (e) => console.info(e)

subscribe('a', h)
subscribe('b', h)

emit('a', {
	data: 123,
})

unsubscribe('a', h)
unsubscribe('b', h)
```

### Other tabs

`emit` only reaches the current browser tab. `broadcast` sends the event to the other tabs of the same Nextcloud instance through a [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API). Like `BroadcastChannel`, the current tab does not receive it: also call `emit` if it should. Public pages do not broadcast.

```js
import { broadcast, emit } from '@nextcloud/event-bus'

emit('my-app:item:updated', { id: 42 })
broadcast('my-app:item:updated', { id: 42 })
```

On the receiving side nothing changes: `subscribe()` gets events from `emit()` in the same tab and from `broadcast()` in other tabs alike.

```js
import { subscribe } from '@nextcloud/event-bus'

subscribe('my-app:item:updated', ({ id }) => refresh(id))
```

- The payload is copied with the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm): other tabs receive plain data, class instances lose their prototype. A payload that cannot be cloned is not sent. `@nextcloud/files` nodes are in that case: broadcast `node.toJSON()` and rebuild the node in the subscribers.
- Every open tab receives the event, so broadcast the result of something the user did in this tab, not something each tab computes on its own.

#### When to use which

Broadcast what the user changed in this tab and other tabs show too. Keep everything else local.

| Event | Use | Why |
|---|---|---|
| File favorited, renamed, moved or deleted | `emit` + `broadcast` | Other tabs list the same files |
| Display name, avatar or status changed | `emit` + `broadcast` | Shown in every tab's header |
| User setting toggled (hidden files, grid view, theme) | `emit` + `broadcast` | Should apply everywhere |
| Notification dismissed or marked read | `emit` + `broadcast` | Avoids it popping up again elsewhere |
| Sidebar opened, modal shown, selection changed | `emit` | Only this tab's UI |
| Upload progress | `emit` | Each tab tracks its own uploads |
| Updates from polling or notify_push | `emit` | Every tab already receives them, broadcasting would duplicate |
| Payloads holding Vue components, DOM nodes or other live objects | `emit` | Cannot be copied to another tab |

### Typed events

It is also possible to type events, which allows type infering on the event-bus methods like `emit`, `subscribe` and `unsubscribe`.
To register new events, simply extend the `NextcloudEvents` interface:

1. Create a file like `event-bus.d.ts`:

```ts
declare module '@nextcloud/event-bus' {
	interface NextcloudEvents {
		'example-app:awesomeness:increased': { level: number }
	}
}

export {}
```

2. Now if you use any of the event bus functions, the parameters will automatically be typed correctly:

```ts
import { subscribe } from '@nextcloud/event-bus'

subscribe('example-app:awesomeness:increased', (event) => {
	// "event" automatically infers type { level: number}
	console.log(event.level)
})
```

## Naming convention

To stay consistent, we encourage you to use the following syntax when declaring events

`app-id:object:verb`

### Examples:

- `nextcloud:unified-search:closed`
- `files:node:uploading`
- `files:node:uploaded`
- `files:node:deleted`
- `contacts:contact:deleted`
- `calendar:event:created`
- `forms:answer:updated`

## Development

```sh
npm install

npm run build
npm run test
```

### Requirements

- [Node 20 or higher](https://nodejs.org/en/download/)
- [NPM 10 or higher](https://www.npmjs.com/package/npm)
