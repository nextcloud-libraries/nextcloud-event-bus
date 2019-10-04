# @nextcloud/event-bus

[![Build Status](https://travis-ci.com/nextcloud/nextcloud-event-bus.svg?branch=master)](https://travis-ci.com/nextcloud/nextcloud-event-bus)
[![npm](https://img.shields.io/npm/v/@nextcloud/event-bus.svg)](https://www.npmjs.com/package/@nextcloud/event-bus)

A event bus to communicate between Nextcloud components

## Usage

```js

import { subscribe, unsubscribe, emit } from '@nextcloud/event-bus'

const h = e => console.info(e)

subscribe('a', h)
subscribe('b', h)

emit('a', {
    data: 123,
})

unsubscribe('a', h)
unsubscribe('b', h)

```
