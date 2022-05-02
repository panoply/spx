---
layout: base.html
title: 'SPX | Single Page XHR'
permalink: '/'
---

<main class="hero d-grid ac-center vh-100">

  <div class="hero-github">
    <a href="https://github.com/panoply/spx">
      {% svg "github", 'icon' %}
    </a>
  </div>

  <div class="d-flex flex-column as-center jc-center">
    <a href="#" class="hero-logo d-block">
      {% svg "logo", 'icon' %}
    </a>
  </div>

  <div class="d-flex flex-column m-auto fc-white text-center">
    <h4 class="d-block italic">
      <strong>Single Page XHR</strong>
      enhancement for
      <strong>SSR</strong>
      powered web applications.<br> SPX is a lightening fast, lightweight
      <small>(8kb gzip)</small>
      push state solution.
    </h4>
  </div>

  <div class="d-flex flex-column m-auto cli mt-2">
    <pre class="language-js"><code>pnpm add spx</code></pre>
  </div>

   <div class="d-flex flex-column m-auto cli mt-2">
    <a data-spx-disable href="{{ '/installation' | url }}">
    Install
    </a>
  </div>

</main>