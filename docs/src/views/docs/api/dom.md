---
title: 'SPX Methods | DOM Literal - spx.dom'
layout: base.liquid
group: api
permalink: '/api/dom/index.html'
anchors:
  - 'Single Element Return'
  - 'Array of Elements'
  - 'Raw Markup Literal'
---

# spx.dom

The `{js} spx.dom` method is a helper utility designed to transform markup literals into actual HTML elements from a string literal. This method intelligently interprets the provided markup structure, returning an accurate element representation tailored to your input.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

// JavaScript Example
spx.dom``;

// TypeScript Example using Generic Arguments
spx.dom<HTMLElement>``;
```

> The SPX [VSCode Extension](/usage/vscode-extension/) supports HTML IntelliSense capabilities directly within `spx.dom` markup template literals. Code contained within DOM literals will provide completions, hovers and syntax highlighting.

---

### Single Element Return

When the markup literal defines a single, self-contained structure (e.g, `<div>Hello</div>`), the return value will be a `HTMLElement` element. TypeScript users can provide generic arguments to set return type value.

```ts
import spx from 'spx';

const button = spx.dom<HTMLButtonElement>`
  <button type="button">
    Hello World!
  </button>
`;

console.log(button); // HTMLButtonElement
```

### Array of Elements

When the markup consists of multiple sibling elements without a common parent (e.g, `{html} <li>A</li> <li>B</li>`), then `spx.dom` will return an array of `HTMLElement[]` elements.

```ts
import spx from 'spx';

const items = spx.dom<HTMLLIElement[]>`
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
`;

console.log(items); // HTMLLIElement[];

items[0]; // HTMLLIElement
items[1]; // HTMLLIElement
items[2]; // HTMLLIElement
```

> While `spx.dom` can handle multiple sibling elements, it's generally recommended to wrap these elements in a parent container within the markup. This approach not only simplifies DOM manipulation but also ensures that the returned structure is always predictable, whether it's a single element or a wrapped set of elements.

### Raw Markup Literal

For scenarios where you need to reference the original markup string, `spx.dom` exposes a `.raw` property. This property is read-only and can be accessed on either the returned `HTMLElement` or the array of `HTMLElement[]`. This feature is particularly useful for debugging, logging, or when you need to reconstruct or modify the original markup.

<!-- prettier-ignore -->
```js
// Based on above examples

items.raw // <li>Item 1</li>
          // <li>Item 2</li>
          // <li>Item 3</li>

button.raw // <button type="button">
           //   Hello World!
           // </button>
```
