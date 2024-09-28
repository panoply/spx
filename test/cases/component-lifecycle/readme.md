---
title: 'Component Lifecycle'
layout: cases/component-lifecycle/index.liquid
permalink: '/components/lifecycle/index.html'
---

# 🧪 Component Lifecycle Hooks

Lifecycle hooks demonstration, tracking `connect`, `onmount` and `unmount` callback methods within component. The counters will reflect the number of times a hook has executed. We are using `spx-bind` to reflect the counter numbers in the component we have setup for this test case.

Navigating to another page and then back to this page will determine the success. The `onmount` and `unmount` values will change each time this page re-visited. The initial visit will result in `connect` and `onmount` having a value of `1`, with `unmount` having a value of `0` given that no unmount hook has fired until we leave the page.

---
