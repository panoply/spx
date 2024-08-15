---
permalink: '/iframe/using-hooks/page-b/index.html'
layout: iframe.liquid
links: 'using-hooks'
logger: true
name: 'Lifecycle Hooks Demo'
---

# Page B

This page contains contains a counter component. Visiting this page demonstrates how lifecycle hooks incrementally execute. Notice how the `connect` hook executes only once.

{% include 'docs/components/examples/hooks/include/counter' %}
