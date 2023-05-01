---
title: 'Capture'
layout: base.liquid
permalink: '/methods/capture/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx.capture `spx.capture(targets: string[])`

The `capture` method performs a snapshot modification to the current document. Use this to align a snapshot cache record between navigations. This is helpful in situations where the dom is augmented and you want to preserve

**Returns:** `Promise<IPage>`
