---
permalink: '/iframe/using-hooks/page-b/index.html'
layout: iframe-block.liquid
links: 'using-hooks'
logger: true
footer: true
main: 'my-4 pr-5 pl-3'
name: 'Lifecycle Hooks Demo'
---

# Page B

This page contains contains a counter component. Visiting this page demonstrates how lifecycle hooks incrementally execute. Notice how the `connect` hook executes only once.

{% include 'docs/components/examples/hooks/include/counter' %}
