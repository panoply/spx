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

External resources and assets such as those linked within `<script>`, `<link>` tags or references which control how the browser should handle third-parties are considered **Resources** in SPX. These types of markup tags will typically exist in the `<head>` element of documents, but may also exist in the `<body>`.

Because SPX takes control of rendering operations, you will need to consider and inform on how it should handle such occurrences. By default, SPX is setup to handle a small subset of resource elements without any additional configuration, however developers are encouraged to refine and extend support for handling to best fit their applications use case. You should be mindful with external resources such a scripts and styles so as to prevent SPX having to perform exhaustive operations and repeated analysis of resources between navigations.

# Script

TODO

# Style

TODO

# Link

TODO

# Meta

TODO
