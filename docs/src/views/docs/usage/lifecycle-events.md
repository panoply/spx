---
permalink: '/usage/lifecycle-events/index.html'
layout: base.liquid
title: Lifecycle Events
---

# Lifecycle Events

SPX assumes control of the rendering cycle in your web application and provides a visit lifecycle that enables you to perform operations at different points. If you're familiar with virtual DOM frameworks, you'll recognize similarities with lifecycle methods. SPX draws inspiration from the renowned SPA framework, [mithril.js](https://mithril.js.org), for lifecycle execution and offers various approaches for developers to manage renders effectively.

Lifecycle events are dispatched at various points during visit operations, providing access to contextual information in the parameters. This allows you to carry out additional operations at different stages of the SPX render cycle. If needed, events can be cancelled using `preventDefault()` or by returning a boolean value of `false`.

<br>

# Execution Order

The SPX lifecycle events will be triggered in the following order of execution:

:::: grid row
::: grid col-1

:::

::::

| Order | Event Name | Parameters |
| ----- | ---------- | ---------- |
| **1** | `exit`     | [Page](#)  |
| **2** | `prefetch` | [Page](#)  |
| **3** | `visit`    | [Page](#)  |
| **4** | `fetch`    | [Page](#)  |
| **5** | `store`    | [Page](#)  |
| **6** | `cache`    | [Page](#)  |
| **7** | `render`   | [Page](#)  |
| **8** | `load`     | [Page](#)  |
