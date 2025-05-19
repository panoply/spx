# Components

SPX Components are functional curried closures comprised of 3 distinct parts, definition, logic and closure.

# Structure

Functional components adhere to a curried structure, wherein function one will contain our component definitions, and function two will pass a scope parameter containing the component references. Our return function accepts a closure reference for public exposed methods, such as our lifecycle hooks and any event callbacks.

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.component({
  name: '',
  state: {},
  nodes: ['foo'],
})($ => {

  $.fooNode    // Component DOM Nodes
  $.fooNodes   // Component DOM Nodes
  $.fooExists  // Component DOM Nodes

  $.state      // Component State
  $.view       // Component HTMLElement
  $.root       // Document <html> element

  return {
    connect: () => {},
    onmount: () => {},
    onmedia: () => {},
    unmount: () => {}
  };

});
```
