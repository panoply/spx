---
permalink: '/components/nodes/index.html'
title: Components - Nodes
layout: base.liquid
group: components
---

# Component Nodes

Component nodes represent DOM elements associated with a specific component instance and are made available using attribute annotations and act as query selectors. The `spx-node` directive can be used to establish association with components which expects a `<ref>.<identifier>` dot notation value be provided. Every element in the DOM marked with an `spx-node` directive is made accessible within component scope and support both multiple occurrences and referencing.

> Component nodes are not query selected in the traditional sense, but instead are incrementally defined during morphs and traversal operations. Nodes can exist anywhere in the DOM and are registered ahead of time, making the accessible outside of dynamic fragments.

---

# Syntax

# Example
