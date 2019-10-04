# nextcloud-event-bus

A event bus to communicate between Nextcloud components

## Usage

```js

import { subscribe, unsubscribe, emit } from 'nextcloud-event-bus'

const h = e => console.info(e)

subscribe('a', h)
subscribe('b', h)

emit('a', {
    data: 123,
})

unsubscribe('a', h)
unsubscribe('b', h)

```
