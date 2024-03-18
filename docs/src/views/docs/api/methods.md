---
title: 'Methods'
layout: base.liquid
group: api
permalink: '/api/index.html'
sidebar:
  - 'spx.session'
  - 'spx.supported'
  - 'spx.hydrate'
  - 'spx.fetch'
  - 'spx.prefetch'
  - 'spx.visit'
  - 'spx.store'
  - 'spx.capture'
  - 'spx.clear'
  - 'spx.reload'
  - 'spx.disconnect'
---

# Methods

In addition to Lifecycle events, you also have a list of methods available. Methods will allow you some basic programmatic control of the SPX session occurring and provides access to the cache store, snapshot store and various other operational utilities.

```js
import spx from 'spx'

spx.supported: boolean

spx.connect(options?: {}): (callback: (session?: ISession) => void) => void

spx.session(store?: string, merge?:{}): ISession

spx.hydrate(url?: string, targets: string[]): Promise<Page>

spx.fetch(url: string): Promise<Document>

spx.prefetch(string | Element): Promise<Page>

spx.visit(url: string, options?:{}): Promise<Page>

spx.store(url?: string, merge?:{}): Page{}

spx.capture(targets: string[]): Promise<Element[]>

spx.clear(url?: string): void

spx.reload(): Page

spx.disconnect(): void

```

## spx.session `spx.session()`

The `session` method will return the current store instance. This includes all state, snapshots, options and settings of the current session which exists in memory. If you intend of augmenting the session, please note that the store records are created without prototype.

<span class="fc-gray">Returns</span>: `Promise<Page>`
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

#### `spx.hydrate(url: string, targets: string[])`

The `hydrate` method executed a programmatic hydration. The method expects a `url` and string list of element selectors.

**Returns:** `Promise<Page>`<br>
**Events:** `cache > hydrate > load`

<span class="fc-gray">Returns</span>: `Promise<Page>`

## spx.fetch `spx.fetch(url: string)`

Triggers a programmatic fetch. The XHR request response is not cached and no state reference are touched.

<span class="fc-gray">Returns</span>: `Document`

## spx.prefetch `spx.prefetch(link: string | Element)`

The `prefetch` method executed a programmatic Prefetch. The method expects a `url` or `<a href="*"></a>` node as an argument. This method behaves the same way as hover, intersect of proximity prefetches.

**Returns:** `Promise<Page>`<br>
**Events:** `request > cache`

**Returns:** `Document`<br>

## spx.visit `spx.visit(url: string, options?: Options)`

The `visit` method executed a programmatic trigger visit. The method expects a `url` as an argument and optionally accepts an page state options model. This method behaves the same way as trigger.

**Returns:** `Promise<Page>`<br>
**Events:** `replace > request > cache > render > load`

## spx.store `spx.store(url?: string, state?: IState)`

The `store` method returns the records pertaining to the provided `url` or if not defined returns the current location. Optionally pass a `state` object reference to merge and augment the current references.

**Returns:** `Promise<Page>`

## spx.capture `spx.capture(targets: string[])`

The `capture` method performs a snapshot modification to the current document. Use this to align a snapshot cache record between navigations. This is helpful in situations where the dom is augmented and you want to preserve

**Returns:** `Promise<Page>`
