---
permalink: '/components/sugar/index.html'
title: Components - DOM
layout: base.liquid
group: components
anchors:
  - this.dom.map
  - this.dom.each
  - this.dom.contains
  - this.dom.reduce
  - this.dom.filter
  - this.dom.every
  - this.dom.html
  - this.dom.text
  - this.dom.hasClass
  - this.dom.removeClass
  - this.dom.addClass
  - this.dom.toggleClass
  - this.dom.hasAttr
  - this.dom.isAttr
  - this.dom.setAttr
  - this.dom.getAttr
  - this.dom.removeAttr
  - this.dom.on
  - this.dom.off
---

# Sugar

Component sugar is an optional enhancement for interfacing and working with component nodes. By default, sugar is disabled, because it changes the access structure to nodes on the component level, wherein the `Node` and `Nodes` suffix approach will resolve to `undefined` and instead accessible using their identifier name.

<!-- prettier-ignore -->
```js
import spx from 'spx'

class Example extends spx.Component({ sugar: true, nodes: ['foo']}) {

  method() {

    this.foo    // Returns Primitive
    this.foo()  // Returns HTMLElement[]
    this.hasFoo // Returns boolean

  }
}
```

---

### `{js} this.dom.map`

Applies a given function to each element in the set of matched elements, returning a new array with the results. This method is particularly useful for transforming data associated with DOM elements. It can be curried, allowing you to first select the elements and later define the mapping function, enhancing readability and modularity in your code. For instance, you might use it to extract specific attributes from a set of elements or to transform node data into a format more suitable for your application logic.

#### Signature

<!--prettier-ignore-->
```ts
// Parameters
this.dom.map('id', function(node, index, list) {
  return node
};)

// Curried
this.dom.map('id')(function(node, index, list) {
  return node
});
```

---

### `{js} this.dom.each`

Iterates over each DOM element in the set, executing a provided function for each one. This method doesn't return a new array but is invaluable for performing actions on each element individually without needing to collect results. You can curry and chain operations, first selecting elements, then defining what action to take on each. Good for scenarios where you need to manipulate each element's content or attributes directly.

<!--prettier-ignore-->
```ts
// Logs the parameters to console
this.dom.each('demo', function(node, index, list){
  console.log(node)       // => HTMLElement
  console.log(index)      // => number
  console.log(list)       // => HTMLElement[]
})
```

---

### `{js} this.dom.contains`

Tests if at least one element in the matched set satisfies the provided testing function. It's a logical method for checking conditions across multiple elements without needing to loop through them manually. You can curry, and first select the elements you're interested in and later define the condition to test, making your code more declarative. Use this method when you need to check if any element in a group meets certain criteria.

<!--prettier-ignore-->
```ts
// If all element are named <div> then return true
this.dom.contains('demo', node => node.nodeName === 'DIV')
```

---

### `{js} this.dom.reduce`

Reduce the set of matched elements to a single value, which can be any JavaScript value. This method is particularly powerful for aggregating data from elements, like summing up values or collecting unique attributes. You can curry, so functionality allows for a clean separation of concerns, where you first select the elements and then define how to reduce them, enhancing code readability and maintainability.

<!--prettier-ignore-->
```ts
// return an object type with keys as element ids and class name as value
this.dom.reduce('demo', {}, (acc, node) => {
  if (node.id) acc[node.id] = node.className;
  return acc;
})
```

---

### `{js} this.dom.filter`

Created a new array object with elements that match the criteria specified by the provided function. This method is essential for refining your selection based on complex conditions. You can curry and first select all elements that might interest you, then later define the filter criteria, which is useful for dynamically adjusting what elements you're working with based on user interaction or data changes.

<!--prettier-ignore-->
```ts
// return an array with only element that have a value="" attribute
this.dom.filter('demo', (node) => node.matches('[value]'))
```

---

### `{js} this.dom.every`

Checks if every element in the set passes the test implemented by the provided function. It's useful for ensuring all elements meet certain conditions before proceeding with an operation. You can curry and first select elements and then define the universal condition they must satisfy, which is ideal for validation scenarios where all elements must comply with specific rules.

<!--prettier-ignore-->
```ts
// return true if all elements are a <div> otherwise false
this.dom.every('demo', (node) => node.nodeName === 'DIV')
```

---

### `{js} this.dom.html`

Gets or sets the HTML contents of each element in the set of matched elements. When used to set content, it replaces the content of elements with the provided HTML string. This method can be curried and allows for a two-step process: first, select the elements, then decide what HTML to insert, which is particularly useful in template or dynamic content loading scenarios.

<!--prettier-ignore-->
```ts
this.dom.html('demo')(`
  <h1>New innerHTML</h1>
  <p>This will become the new content of the node</p>
`)
```

---

### `{js} this.dom.text`

You can get or set the combined text contents of each element in the set of matched elements, including their descendants.You can curry and first select elements, then later decide whether to retrieve or modify their text content, making it flexible for both reading and manipulating text in your DOM.

<!--prettier-ignore-->
```ts
this.dom.text('demo')('I will be the new innerText')
```

---

### `{js} this.dom.hasClass`

Checks whether all elements in the matched set have the specified class. This method is handy for conditional operations based on element classes. You can curry and first select elements, then later check for class presence, which is useful in scenarios where you need to perform actions based on class states without immediately deciding what those actions are.

<!--prettier-ignore-->
```ts
// Returns true if the element has class name of "example-class"
this.dom.hasClass('demo', 'example-class')
```

---

### `{js} this.dom.removeClass`

Removes one or more classes from each element in the set of matched elements. IT can be curried and allows for a delayed application of class removal, which can be beneficial in scenarios where you're building up a series of DOM manipulations before applying them.

<!--prettier-ignore-->
```ts
// removes both example-class and another-class from the element
this.dom.removeClass('demo', 'example-class', 'another-class')
```

---

### `{js} this.dom.addClass`

**Description:**
Using `this.dom.addClass`, you can add one or more classes to each element in the set of matched elements. This method can be curried and supports a workflow where you first select elements and later decide which classes to add, useful for dynamically styling or categorizing elements based on user interaction or data changes.

<!--prettier-ignore-->
```ts
// Checks whether the element has class named "new-class" and if not, adds it.
this.dom.addClass('demo', 'new-class')
```

---

### `{js} this.dom.toggleClass`

**Description:**
Adds or removes one or more classes from each element in the set of matched elements, depending on either the class's presence or the second parameter. This method's can be curried and allows for a flexible approach where you can first select elements, then decide which classes to toggle based on different conditions or user interactions, making it ideal for dynamic UI adjustments.

<!--prettier-ignore-->
```ts
// If element contains "new-class" it is swapped for "toggled-class"
this.dom.toggleClass('demo', 'new-class', 'toggled-class')
```

---

### `{js} this.dom.hasAttr`

Checks whether the elements in the matched set have at least one of the specified attribute/s. This method is useful for conditional operations based on attribute presence. It can be curried, so you can first select an element, then later check for attribute existence, which is particularly handy when you need to perform actions contingent on attribute states without immediately deciding on those actions.

<!--prettier-ignore-->
```ts
// Checks whether the element an attribute named data-foo
this.dom.hasAttr('demo', 'data-foo')

// Checks whether the element has an id value of bar
this.dom.hasAttr('demo', 'id:bar')
```

---

### `{js} this.dom.setAttr`

Set one or more attributes for each element in the set of matched elements. It can be curried and allows for a two-step process: first, select the elements, then decide which attributes to set, making it flexible for dynamic attribute manipulation based on various conditions or data states.

<!--prettier-ignore-->
```ts
// You can pass arguments for single setter
this.dom.setAttr('demo')('data-foo', 'lorem')

// You can pass an object key > value for multiple setters
this.dom.setAttr('demo', { id: 'qux', value: 'sissel' })
```

---

### `{js} this.dom.getAttr`

Retrieves the value of an attribute for the first element in the set of matched elements. It can be curried, so you can first select elements and later decide which attribute's value to retrieve, which is useful in scenarios where you need to dynamically fetch attribute values for further processing or display.

<!--prettier-ignore-->
```ts
// Obtain the value of a single attribute
this.dom.getAttr('demo', 'value')

// Obtain the value/s of multiple attributes, returns an object
this.dom.setAttr('demo')('value', 'name', 'type')
```

---

### `{js} this.dom.removeAttr`

Removes an attribute from each element in the set of matched elements. This method can be curried and supports a workflow where you first select elements, then later decide which attributes to remove, which can be beneficial for cleaning up elements or preparing them for new data without immediately deciding what to remove.

<!--prettier-ignore-->
```ts
// Remove the id="" attribute from the element
this.dom.removeAttr('demo', 'id')

// Remove multiple attributes from the element
this.dom.setAttr('demo', 'id', 'class')
```

---

### `{js} this.dom.on`

**Description:**
Attaches one or more event handlers for the selected elements and child elements. This method can be curries and allows for a flexible event binding strategy where you can first select elements, then later decide which events to listen for and what actions to perform upon those events. This is particularly useful for setting up event listeners in a modular way, where the element selection and event handling can be separated for better code organization.

<!--prettier-ignore-->
```ts
// Attach a click listener to the element
this.dom.on('demo')('click', e => {})
```

---

### `{js} this.dom.off`

**Description:**
Removes event handlers that were attached with `.on()`. It can be curried, so you can first select elements where you've previously attached event handlers, then later decide which events or handlers to remove. This is crucial for cleaning up event listeners, especially in dynamic applications where elements might be reused or their event handling needs to change over time.

<!--prettier-ignore-->
```ts
// Remove the click listener that was attached
this.dom.off('demo')('click')
```
