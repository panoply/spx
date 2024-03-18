---
title: 'SPX Methods | Render'
layout: base.liquid
group: api
permalink: '/api/render/index.html'
---

# spx.render

The `spx.render` method can be leveraged to perform targeted rendering insertions in the DOM. It works similar to [spx-append](/directives/spx-append) and [spx-prepend](/directives/spx-append) but provides programmatic control over the operation. The method accepts either a function callback that expects a configuration return value.

::: note
Use this method with mindfulness. Expensive operations was cause bottlenecks.
:::

# Example

Below is an example of the method works. You should also take a look at the [SPX Infinite Scrolling](/examples/infinite-scrolling/) example which uses the `spx.render` for infinite pagination.

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.render('/p4p-list?page=2', function(current, fetched) {

  const foo = current.querySelector('#boxers')
  const bar = fetched.querySelector('#boxers')

  foo.append(...bar.children)

  return {
    history: 'replace',
    method: 'append',
    childNodes: true,
    cache: true,
    capture: true
  }

}).then(function(page) {

  console.log(page)

})
```

### Page 1

Let's assume you have click event listener setup for `#next-page` button. When a user clicks the button then the above example snippet fires and a fetch begins for [Page 2](#page-2).

<!--prettier-ignore-->
```html
<!-- Page 1 -->
<main>

  <h1>The P4P lightweight boxing division.</h1>

  <ul id="boxers">
    <li>Vasyl Lomachenko</li>
    <li>Devin Haney</li>
  </ul>

  <button id="next" type="button">
    Next
  </button>

</main>
```

### Page 2

On this page we have 2 additional boxers in a list. Based on the method code [example](#example) above, we will be appending the `childNodes` to the `ul` list using the id `#foo` on Page 1.

<!--prettier-ignore-->
```html
<!-- Page 2 -->
<main>

  <h1>The P4P lightweight boxing division.</h1>

  <ul id="boxers">
    <li>Vasyl Lomachenko</li>
    <li>Devin Haney</li>
  </ul>

</main>
```
