# @nextcloud/event-bus

[![Build Status](https://travis-ci.com/nextcloud/nextcloud-event-bus.svg?branch=master)](https://travis-ci.com/nextcloud/nextcloud-event-bus)
[![npm](https://img.shields.io/npm/v/@nextcloud/event-bus.svg)](https://www.npmjs.com/package/@nextcloud/event-bus)
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

const h = e => console.info(e)

subscribe('a', h)
subscribe('b', h)

emit('a', {
    data: 123,
})

unsubscribe('a', h)
unsubscribe('b', h)
```

## Naming convention

To stay consistent, we encourage you to use the following syntax when declaring events

`app-id:object:verb`

### Examples:

- `nextcloud:unified-search:closed`
- `files:file:uploading`
- `files:file:uploaded`
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

- [Node 14 or higher](https://nodejs.org/en/download/)
- [NPM 7 or higher](https://www.npmjs.com/package/npm)

### Recommendations

- [Node 16](https://nodejs.org/en/download/)
- [NPM 8](https://www.npmjs.com/package/npm)
