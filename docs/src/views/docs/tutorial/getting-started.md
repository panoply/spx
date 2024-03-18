---
title: 'Getting Started'
layout: base.liquid
group: 'directive'
permalink: '/tutorial/index.html'
grid: 'col-md-8'
---

# Getting Started

SPX assumes developers have an intermediate level of font-end knowledge. Before leveraging the module and going ahead with this small tutorial, it's important to familiarize yourself with a couple of its [key concepts](/introduction/key-concepts) and have some idea of how SPX works. We will use a sample project which you can find on [Github](#) and go over most of the major things you'll deal with while using SPX.

> This tutorial will describe SPX usage in TypeScript using the [pnpm](https://pnpm.io) package manager and [tsup](https://tsup.egoist.dev) bundler. If you do not use TypeScript or prefer a different development stack, you can make adjustments where necessary.

<br>

# Install SPX

Let's start by installing SPX into your project. SPX is an ESM module, which means that you'll need to ensure that your `package.json` file is marked with type `module`. Open up your terminal and run the following command:

```bash
$ pnpm add spx --save
```

<br>

# Project Structure

We will be creating components in this tutorial and going over various capabilities of SPX, though there is no imposed structure to follow, for this tutorial and the sake of brevity, we will assume the following directory structure:

```treeview
/
└── src/
    ├── app/                      # This directory will contain your .ts files
    │   ├── components/     # This is where we will place out components
    │   └── bundle.ts      # This is our entry point file
    ├── views/                  # This directory contains our static pages
    ├── package.json
    ├── tsconfig.json
    └── tsup.config.ts
```

<br>

# SPX Connection

SPX will become the communication point of your application, as such we can use it as our default export and have a single point of control from which we will update when necessary. In our `bundle.ts` file, let's establish a connection with SPX, we will provide some options upon connection and later on describe them.

<!--prettier-ignore-->
```ts
import spx from 'spx';

spx.connect();

```

The above code will initialize SPX and establish a connection. Once SPX is connected, it will take over the rendering cycle of your web application. By default, SPX will morph the entire `<body>` content between navigations, you can adjust that using the `fragments` option, but for now let's use the above basic configuration.

# Script Evaluation

In SPX there are 2 important rules you should follow. First, add JavaScript files within the `<head>` element of your application and second, ensure that you prevent evaluation on the script that establishes a connection. You can prevent evaluation by marking the `<script>` tag containing SPX with a `spx-eval="false"` attribute. This will ensure that SPX is not re-initialized for each navigation and when it is not applied, SPX will re-initialize for all subsequent visits and not function as intended.

<!--prettier-ignore-->
```html
<head>
  <!-- DO NOT EVALUATE -->
  <script
    src="/bundle.js"
    spx-eval="false"
    async="true"></script>
</head>
```

<br>

# Creating Components

Let's create some SPX components and add them to our web application. You should checkout the [components](/components/structure) section of the documentation for a more complete grasp of things, but for the sake of this tutorial we will write some basic components and walk through how to register and leverage them within SPX. Let's start with a basic counter component, create a new file called `counter.ts` in the `components` directory of your project and add the following code:

<!--prettier-ignore-->
```ts
import spx, { SPX } from 'spx';

export class Counter extends spx.Component<typeof Counter.connect> {

  public countNode: HTMLElement;

  static connect = {
    nodes: <const>['count' ],
    state: {
      count: Number
    }
  };

  increment () {
    this.countNode.innerText = `${++this.state.count}`;
  }

  decrement () {
    this.countNode.innerText = `${--this.state.count}`;
  }

}
```

Now that we've created our component, we need to register it so SPX knows it exists. Open up the `bundle.ts` entry point file where we called `spx.connect()` then import and register our counter component.

<!--prettier-ignore-->
```ts
import spx from 'spx';
import { Counter } from './components/counter'

spx.connect({
  components: { Counter } // Provide the component in an object
});
```

Next, let's create a template in our DOM. SPX components adhere to a simple directive pattern and use attribute reference to establish control of components. Our static `connect` object defined on the `Counter` component class acts as our configuration model will be used by SPX internally to establish instances.

:::: grid row gx-0
::: grid col-7 demo-left

<!--prettier-ignore-->
```html
<section spx-component="counter">
  <!-- Element -->
  <h1>
    Count: <span spx-node="counter.count">0</span>
  </h1>
  <!-- Buttons -->
  <button
    type="button"
    spx@click="counter.increment"> + </button>
  <button
    type="button"
    spx@click="counter.decrement"> - </button>
</section>
```

:::
::: grid col-5 js-center as-stretch bg-code bl by br demo-right

{% include 'tutorial/counter-1' %}

:::

A simple counter component is great way to get us started, but we need something a little more advanced to explore the capabilities of SPX components. Let's make another component that allows us to provide Tabs in our web application, begin by creating a new file called `tabs.ts` within your `components` directory and add the following code:

<!--prettier-ignore-->
```ts
import spx, { SPX } from 'spx';

export class Tabs extends spx.Component<typeof Tabs.connect> {

  public buttonNode: HTMLElement;
  public panelNodes: HTMLElement[];

  static connect = {
    nodes: <const>['button', 'panel'],
    state: {
      init: Number,
      open: Number
    }
  };

  oninit () {
    this.state.hasInit && this.toggle({
      attrs: {
        idx: this.state.init
      }
    });
  }

  open (idx: number) {
    this.buttonNode.children[idx].classList.add('active');
    this.panelNodes[idx].classList.remove('d-none');
  }

  close(idx: number) {
    this.buttonNode.children[idx].classList.remove('active');
    this.panelNodes[idx].classList.toggle('d-none', true);
  }

  toggle (event: SPX.Event<{ idx: number }>) {
    if (this.state.open !== event.attrs.idx) {
      this.state.open = event.attrs.idx;
      for (let idx = 0, len = this.panelNodes.length; idx < len; idx++) {
        idx === event.attrs.idx ? this.open(idx) : this.close(idx);
      }
    }
  }
}
```

Our Tabs component is a little more complex than our Counter component. In our Tabs component, we are leveraging the `oninit` SPX lifecycle hook and also passing an `attrs` reference on the `toggle()` callback. Let's create a Tabs template in the DOM and expand upon the component scope.

:::: grid row gx-0
::: grid col-7 demo-left

<!--prettier-ignore-->
```html
<section spx-component="tabs" spx-tabs:init="2">
  <!-- Buttons -->
  <div spx-node="tabs.button">
    <button
      type="button"
      spx@click="tabs.toggle"
      spx-tabs:idx="0"> Foo </button>
    <button
      type="button"
      spx@click="tabs.toggle"
      spx-tabs:idx="1"> Bar </button>
    <button
      type="button"
      spx@click="tabs.toggle"
      spx-tabs:idx="2"> Baz </button>
  </div>
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

:::
::: grid col-5 js-center as-stretch bg-code bl by br demo-right

{% include 'tutorial/tabs-1' %}

:::
