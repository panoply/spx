---
permalink: '/iframe/using-hooks/page-c/index.html'
layout: iframe.liquid
data: 'using-hooks'
name: 'Lifecycle Hooks Demo'
---

# Page C

This page will trigger another component to demonstrate how lifecycle hooks incrementally execute. The component being rendered is a simple counter component. Notice the changes in the rolling log.

{% include 'examples/hooks-counter' %}
