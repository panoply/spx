---
title: 'Getting Started'
layout: base.liquid
permalink: '/introduction/getting-started/index.html'
---

# Getting Started

SPX assumes developers have an intermediate level of font-end knowledge. Before leveraging the module, it's important to familiarize yourself with a couple of its [key concepts](/introduction/key-concepts). This page intends to give you an understanding of how you'd leverage, integrate and use SPX in your web application.

The best way to demonstrate how you can use SPX is through a real world example. We will use a sample project and go over most of the major things you would need to deal with while using SPX.

---

# Sample Website

We will be integrating SPX into the below sample website which consists of 4 different pages. We will first go through SPX connection and then we will create 2 SPX Components.

<div spx-component="tabs">

{% include 'sample/tabs' %}

<div class="col-12 tab-content" spx-node="tabs.tab">

```html
{% include 'sample/pages/home' %}
```

</div>
<div class="col-12 tab-content d-none" spx-node="tabs.tab">

```html
{% include 'sample/pages/about' %}
```

</div>
<div class="col-12 tab-content d-none" spx-node="tabs.tab">

```html
{% include 'sample/pages/counter' %}
```

</div>
<div class="col-12 tab-content d-none" spx-node="tabs.tab">

```html
{% include 'sample/pages/contact' %}
```

</div>
</div>
