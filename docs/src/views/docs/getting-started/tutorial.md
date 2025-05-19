---
permalink: "/tutorial/index.html"
title: "Tutorial"
layout: base.liquid
anchors:
  - Tutorial
  - Install SPX
  - Project Structure
  - Connect SPX
  - Script Evaluation
  - Creating Components
  - Registering Component
  - Counter Markup
  - Tabs Component
  - Register Tabs
  - Tabs Markup
---

# Tutorial

SPX operates under the assumption that developers possess an intermediate level of frontend knowledge. Before delving into this tutorial, it's essential to familiarize yourself with a few [key concepts](/introduction/key-concepts) and gain a basic understanding of how SPX functions. We'll be utilizing a sample project available on [GitHub](#), covering the major aspects of SPX along the way. This tutorial will demonstrate SPX usage in TypeScript using the [pnpm](https://pnpm.io) package manager and [tsup](https://tsup.egoist.dev) bundler. However, if you're not using TypeScript or prefer a different development stack, feel free to make necessary adjustments to suit your preferences.

---

# Install SPX

To begin, let's install SPX into your project. SPX is an ESM (ECMAScript Module) module, so it's crucial to ensure that your **package.json** file is marked with the type `module`. For additional information on installation, you can refer to [Installation](/introduction/installation).

:: row mt-4
:: col-12 col-md-6 pr-4 mb-4

#### PNPM

```bash
$ pnpm add spx --save
```

::
:: col-12 col-md-6 pr-4

#### NPM

```bash
$ npm install spx --save
```

::
::

---

# Project Structure

In this tutorial, we'll create components and explore various capabilities of SPX. While there's no strict structure imposed, for the sake of brevity and simplicity, we'll assume that your project follows the following directory structure:

```treeview
/
└── src/
    ├── app/                      # This directory will contain your .ts files
    │   ├── components/     # This is where we will place our components
    │   └── bundle.ts      # This is our entry point file
    ├── views/                  # This directory contains our static pages
    ├── package.json
    ├── tsconfig.json
    └── tsup.config.ts
```

---

# Connect SPX

To establish SPX as the communication point of your application, we'll use it as our default export and initialize it using the `spx()` method. This method requires no options initially and will use the defaults. Once SPX is connected, it will take over the rendering cycle of your web application. Add the following code to your `bundle.ts` file:

<!-- prettier-ignore -->
```ts
import spx from 'spx';

spx(/* options */)(function () {

  console.log('SPX Connected!');

});
```

By default, SPX will morph the entire `{html} <body>` content between navigations. If you wish to adjust this behavior, you can do so using the [fragments](/usage/options#fragments) option. However, for now, let's stick to the basic configuration provided above. You can find more information about fragments in the [Key Concepts](/introduction/key-concepts) page.

---

# Script Evaluation

In SPX, adherence to two crucial rules is paramount. Firstly, it's imperative to include JavaScript files within the `{html} <head>` element of your application. Secondly, it's vital to prevent evaluation on the script responsible for establishing a connection to SPX. This can be achieved by adding a `{html} <script spx-eval="false">` attribute to the tag containing SPX. This precautionary measure ensures that SPX isn't re-initialized for each navigation.

> Failure to implement this attribute may lead to SPX re-initializing for all subsequent visits, compromising its intended functionality.

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My SPX App</title>
    <!--
      Add JavaScript files within the <head> element
    -->
    <script src="bundle.js" spx-eval="false"></script>
  </head>
  <body>
    <!-- Your page content goes here -->
  </body>
</html>
```

---

# Creating Components

Let's proceed with creating SPX components to integrate into our web application. In this tutorial, we'll craft simple components and delve into the process of registering and utilizing them. We will start by developing a counter component, aiming to enable incrementing and decrementing a number utilizing SPX Component [events](/components/events), [state](/components/state), and [nodes](/components/nodes). Begin by generating a new file named `counter.ts` in the `./src/app/components/` directory of your project:

<br>

### `counter.ts`

<!--prettier-ignore-->
```ts
import spx, { SPX } from 'spx';

export class Count extends spx.Component({
  state: {
    clicks: 0 // our initial component state available via this.state
  }
}) {

  increment () {
    ++this.state.clicks; // augments the state
  }

  decrement () {
    --this.state.clicks; // augments the state
  }

}
```

---

# Register Component

Now that we have our component defined, the next step is to register it with SPX so that SPX recognizes its existence. Let's open up the `bundle.ts` entry point file where we called `spx()` and proceed to import and register the component.

<br>

### `bundle.ts`

<!--prettier-ignore-->
```ts
import spx from 'spx';
import { Counter } from './components/counter'

export default spx({
  components: {
    Counter // Provide the component in an object
  }
});
```

> You can also register components using the `spx.register()` API method. For further details, please refer to the [Component Register](/components/register/) section of the documentation.

---

# Counter Markup

Now, it's time to integrate our component into the DOM. SPX components follow a simple directive pattern, utilizing attribute references as the control mechanism between the component and the DOM. The static `connect` object defined on the `Counter` component class serves as our configuration model, and the data provided via `connect` will be used by SPX internally when establishing instances.

<!--prettier-ignore-->
```html
<section spx-component="count">
  <!-- Element -->
  <h1>
    Count: <span spx-bind="count.clicks">0</span>
  </h1>
  <!-- Buttons -->
  <button spx@click="count.increment"> + </button>
  <button spx@click="count.decrement"> - </button>
</section>
```

---

# Tabs Component

A simple counter component is an excellent starting point, but let's create a slightly more advanced component to explore the capabilities of SPX further. We'll design a Tabs component that allows us to incorporate tabs into our web application. While still relatively straightforward, this component will enable us to delve into additional features. Following the same approach as with our Counter component, let's create a new file in the `./src/app/components/` directory named `tabs.ts` and add the following code:

<br>

### `tabs.ts`

<!--prettier-ignore-->
```ts
import spx, { SPX } from 'spx';

export class Tabs extends spx.Component({
  sugar: true,
  nodes: <const>[
    'button',
    'panel'
  ],
  state: {
    init: Number,
    open: Number
  }
}) {

  toggle ({ attrs }: SPX.Event<{ panel: number }>) {

   if (this.state.open === attrs.panel) return;

    this.button(button => button.toggleClass('active'))
    this.panel(panel => panel.toggleClass('opened'))
    this.state.open = attrs.panel;

  }
}
```

<br>

Our Tabs component introduces a bit more complexity compared to the Counter component, particularly highlighting the `connect()` method. SPX components support [lifecycle hooks](/components/hooks/), triggered at various points during rendering and fetching cycles. Another significant aspect of the Tabs component is the event argument passed to the `toggle(event)` method. Here, we're leveraging the SPX event `attrs` feature, enabling parameter values to be passed in via directives in the DOM.

---

# Register Tabs

Just as we did with our [Counter Component](#6-registering-component), we need to make SPX aware that the Tabs component exists. Open up the `bundle.ts` entry point file where we called `spx()` and let's register the component.

<br>

### `bundle.ts`

<!--prettier-ignore-->
```ts
import spx from 'spx';
import { Counter } from './components/counter'
import { Tabs } from './components/tabs'

export default spx({
  components: {
    Counter,
    Tabs     // Provide the component in an object
  }
});
```

---

# Tabs Markup

In our Tabs component markup, you'll notice a couple of additional directives within the `<section>` and `<button>` elements. These XML-like attributes are known as [State Directives](/components/state). State Directives facilitate the transfer of data from the DOM to our components. They adhere to the `spx-<component>:<key>` structure and can only be annotated on component and event node types. These directives are responsible for passing data from the DOM to our component, specifically when they are present on component and event node types.

State Directives serve as a means to define component state directly from the DOM, facilitating its usage within our component. These directives establish two-way bindings, seamlessly connecting components and markup to one another. Consequently, any modifications to the state will be automatically reflected in the DOM, ensuring consistent synchronization between the two.

```html
<section spx-component="tabs" spx-tabs:init="2">
  <!-- Buttons -->
  <button spx@click="tabs.toggle" spx-tabs:panel="0">Foo</button>
  <button spx@click="tabs.toggle" spx-tabs:panel="1">Bar</button>
  <button spx@click="tabs.toggle" spx-tabs:panel="2">Baz</button>
  <!-- Panels -->
  <div spx-node="tabs.panel">
    <h1>Foo Panel</h1>
  </div>
  <div spx-node="tabs.panel">
    <h1>Bar Panel</h1>
  </div>
  <div spx-node="tabs.panel">
    <h1>Baz Panel</h1>
  </div>
</section>
```

> The static `define.state` object serves as an interface for state directives. These directives are considered as default values when provided and are parsed according to the Type Constructor specified.
