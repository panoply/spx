---
title: 'Session'
layout: base.liquid
group: api
permalink: '/api/session/index.html'
---

# spx.session `spx.session()`

The `session` method will return the current store instance. This includes all state, snapshots, options and settings of the current session which exists in memory. If you intend of augmenting the session, please note that the store records are created without prototype.

<span class="fc-gray">Returns</span>: `Promise<Page>`
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>
