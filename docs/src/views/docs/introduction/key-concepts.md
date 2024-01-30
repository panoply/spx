---
title: 'Key Concepts'
layout: base.liquid
permalink: '/introduction/key-concepts/index.html'
prev:
  label: 'Introduction'
  uri: '/introduction/what-is-spx/'
next:
  label: 'Session'
  uri: '/introduction/session/'
---

# Key Concepts

SPX assumes developers have an intermediate level of font-end knowledge. Before leveraging the module, it's important to familiarize yourself with a couple of its key concepts which are listed on this page. When using SPX, all `href` link clicks are intercepted and seamlessly executed over the wire using [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest) so your web application will never perform full-page reloads, but instead partial (morphed) replacements. The XHR (DOM String) responses are stored in browser state and an active cache is persisted until a hard-refresh is incurred or hostname changes.

The actual fetching operation happens preemptively and SPX offers varying sets of user defined configuration options for performing DOM element replacements when navigating between different urls of the same hostname. SPX is designed to replicate native browser behavior but developers should be mindful in their implementation.

{% include 'layout/iframe', url: '/iframe/using-defaults/page-a' %}

---

# Fragments

Fragments in SPX refer to a collection of elements, identified by a selector, that coexist within web pages. By default, SPX assumes that descendant elements of `<body>` are dynamic and unique for each page in your web application. However, in reality, websites comprise both dynamic and static elements. It is not only encouraged but also considered good practice to explicitly define a set of fragments. This will help prevent SPX from performing extraneous DOM diffing operations every time a page visit occurs.

You can define fragments in SPX either upon connection via the [`spx.connect()`](/api/connect)) method. SPX also supports directive overrides for defining fragments on a per-page level using attribute annotation. Link elements in the DOM which contain an [`spx-fragment`](/attributes/spx-fragment) attribute can be used to target a different set of elements between navigations.

<br>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect({
  fragments: [
    'nav',      // Targets HTML element <nav>
    'main'      // Targets HTML element <main>
  ]
});
```

---

# Morphing

DOM morphing, at its core, is a rendering process employed by SPX to dynamically transform the DOM during page navigation. Unlike traditional page loading approaches.

Here, the `fragments` option accepts a `string[]` list of query selector references, indicating which elements are expected to change. When this option is left undefined, SPX will default to swapping out changed nodes within the `<body>` during each navigation. Let's take a simple example of a basic DOM structure for SPX to work with:

```html
<body>
  <nav>
    <a href="/" class="active">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
  <main>
    <h1>Welcome to my site!</h1>
    <p>This website is using SPX</p>
  </main>
  <footer>Copyright 2023</footer>
</body>
```

In this case, the `<nav>`, `<main>`, and `<footer>` elements exist in the same structure for all three pages (home, about, and contact), based on the links contained in the `<nav>` node. Using this logic, when navigating between pages, the inner contents of `<nav>` and `<main>` are expected to change, while the contents in the `<footer>` will remain the same.

By specifying the `targets` option as `['nav', 'main']` upon `spx.connect()`, SPX will only perform necessary updates on the elements defined as targets. This means that when you click the "about" link, only the specified elements in the `<nav>` and `<main>` will be updated, while the rest of the page remains untouched. This approach drastically reduces the number of operations performed compared to traditional SSR (Server-Side Rendering) websites, resulting in better rendering and overall performance.

Using targets is highly encouraged when working with SPX, as it not only improves the performance and rendering capabilities of the module but also promotes good practices when dealing with markup languages like HTML. So, leverage targets to unlock the full potential of SPX in your web application.

---

# Navigation

SPX actively monitors events occurring on `<a>` elements within the DOM. This is the fundamental behavior of the module, as it revolves around link interception and navigational intent. When a user clicks on any link, SPX steps in to manage the navigation process. The link elements are essential to SPX, serving as representations of your web application routes and providing insights into the browsing intent of the end user.

By default, SPX ensures that all link clicks follow its prescribed behavior based on annotations present on `<a>` elements. However, you have the flexibility to control the execution by using attributes to customize SPX's behavior on a per-page level. This way, you can fine-tune SPX to suit the specific needs of your web application.

<!-- prettier-ignore -->
```html
<!-- Disable SPX, when true a normal page visit ensues -->
<a spx-disable="true"></a>

<!-- Render Method, accepts: "replace", "morph" and "assign" -->
<a spx-render="replace"></a>

<!-- Hover Prefetch, executes a pre-fetch upon pointerover -->
<a spx-hover="true"></a>

<!-- Prefetch Proximity, executes a pre-fetch when pointer is within x distance -->
<a spx-proximity="100"></a>

<!-- Intersection Prefetch, executes intersection pre-fetches with Intersection Observer -->
<a spx-intersect="50"></a>

<!-- Position Control, controls the scroll position of the next visit -->
<a spx-position="y:0"></a>

<!-- Target Control, a list of selector elements to target -->
<a spx-target="['#node']"></a>

<!-- Cache Control, controls caching for the next navigation -->
<a spx-cache="false"></a>

<!-- History Control, controls history API for the next navigation -->
<a spx-history="replace"></a>

<!-- Prepend Control, prepend targets to one another in next navigation -->
<a spx-prepend="['#foo', '#bar']">

<!-- Append Control, append targets to one another in next navigation -->
<a spx-append="['#foo', '#bar']">

<!-- Threshold Limits, control the threshold of an operation of the url -->
<a spx-threshold="250">

<!-- Progress Control, whether or not to show a progress bar on next navigation -->
<a spx-progress="false">

<!-- Hydration Fetch, apply a DOM hydration fetch in next navigation -->
<a spx-hydrate="['.xxx']">

```

---

# Prefetching

At the core of SPX lies the concept of prefetching, which plays a crucial role in determining visit intent. Prefetching allows SPX to anticipate user actions and be proactive in fetching the required content in advance. This significantly enhances the navigation experience for users. SPX offers multiple ways for developers to implement prefetching, providing flexibility and control for varying use cases.

By default, SPX performs prefetches upon pointer hover events. However, this may not always be the most suitable approach for every scenario. Therefore, SPX offers three additional methods of prefetching, enabling developers to choose the most appropriate option based on their specific needs. To make the process seamless, SPX allows you to pre-define prefetch operations upon connecting to the SPX module. This means you can set up prefetching behaviors right from the start. Alternatively, if you prefer more granular control, you can customize prefetch execution on a per-link level within the DOM using attribute annotations. This allows you to fine-tune prefetching for individual links based on their importance or relevance.

Moreover, you can also combine both connection presets and DOM customizations to create a comprehensive prefetching strategy tailored to your web application's requirements. By leveraging SPX's prefetching capabilities, you can optimize navigation efficiency, minimize loading times, and provide end-users with a more refined experience.

### Pre-fetch Options

```js
import spx from 'spx';

spx.connect({
  annotate: false,
  hover: {
    trigger: 'href',
    threshold: 250
  },
  intersect: {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  },
  proximity: {
    distance: 75,
    threshold: 250,
    throttle: 500
  }
});
```

### Pre-fetch Attributes

```html
<!-- If annotate is true, provide spx-hover attributes to perform hover pre-fetch -->
<a spx-hover="true"></a>

<!-- Control the threshold of hover, proximity and intersect pre-fetches-->
<a spx-threshold="500"></a>

<!-- Control the distance of proximity prefetches -->
<a spx-proximity="400"></a>

<!-- Control the root margin of intersection prefetches -->
<a spx-intersect="50px"></a>

<!-- Exclude certain links from intersection prefetches -->
<a spx-intersect="false"></a>
```

---

# Caching

SPX incorporates an efficient in-memory cache to store fetched pages. After each visit, a snapshot representing the raw DOM as a string is stored in the browser's local memory. While this might raise concerns about performance, it's worth noting that SPX snapshots are relatively inexpensive in terms of memory usage.

Each SPX snapshot (DOM String) remains accessible throughout an SPX session, preserving the state of the visited pages. The cache is available until a full page refresh occurs or the hostname changes, ensuring seamless navigation within the session. The cache algorithm employed by SPX is pre-emptive, making visits a low-cost operation. SPX executes visits asynchronously and sequentially, without blocking other tasks. Requests can be easily aborted, queued, and prioritized, which is particularly useful when multiple requests are awaiting processing, and a user clicks on a link that's at the end of the queue. SPX's intelligent handling ensures smooth and optimized navigation in such cases.

Additionally, SPX makes use of the HistoryAPI `state` reference when performing cached visits, further enhancing the efficiency of the caching mechanism. It also respects the execution of external resources such as scripts and styles, ensuring a seamless browsing experience for users.
