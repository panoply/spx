---
title: 'Resource Evaluation'
layout: base.liquid
permalink: '/usage/resource-evaluation/index.html'
prev:
  label: 'Options'
  uri: '/usage/options'
next:
  label: 'Methods'
  uri: '/methods/'
---

# Resource Evaluation

External resources such as `<script src>`, `<link href>` elements or those with control how the browser should behave (e.g: `<link preload>`) are considered **Resources** in SPX. These types of markup tokens will _typically_ be placed in the `<head>` element of documents, but may also exist in the `<body>`. Because SPX takes control of the SSR rendering operations, you will to consider and inform on how it should handle occurrences.

The default options which SPX ships with are configured to handle a small subset of resource elements, but you can customize and extend support for handling. You should be mindful with external resources such a scripts and styles so as to prevent SPX having to perform exhaustive operation between navigations and in cases where you want to prevent SPX from running you can annotate the `<html>` element with a `spx-ssr` attribute.

This page describes how SPX handles each resource it encounters, the execution approach and customization options.

# Script

TODO

# Style

TODO

# Link

TODO

# Meta

TODO
