---
title: 'Key Concepts'
layout: base.liquid
group: introduction
permalink: '/introduction/key-concepts/index.html'
grid: 'col-md-8'
---

# Key Concepts

Before using SPX, it is important to acquaint yourself with a few of its fundamental **key concepts** outlined on this page. Gaining familiarity with these concepts and understanding the approaches employed by SPX will allow you to better leverage the module in an effective manner and enable you to take advantage of its capabilities with more command.

<br>

# Rendering Cycle

SPX integrates into your web application and takes control of the rendering cycle. It achieves this by intercepting link clicks and executing navigation in an isolated and controlled manner. Pages are fetched over the wire using [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest) and the XHR (DOM String) responses are stored in browser state where they will remain until called upon.

{% include 'flow' %}

# Fragments

In SPX, fragments pertain to elements annotated with the `id` attribute that persist across various pages of your website. These fragments constitute the dynamic components of your web application, as their descendant elements undergo changes. Websites generally consist of a combination of dynamic and static elements. Static elements remain consistent across multiple visits, while dynamic elements vary with each visit.

:::: grid row
::: grid col-6

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect({
  fragments: [
    'menu',  // <nav id="menu"></nav>
    'main'   // <div id="main"></div>
  ]
});
```

:::
::: grid col-6

<!-- prettier-ignore -->
```html
<body>
  <header>
    <nav id="menu"><!-- --></nav>
  </header>
  <main>
    <div id="main"><!-- --></div>
  </main>
</body>
```

:::
::::

<br>

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

<br>

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

# How it works?

SPX integrates into your web application and takes control of the rendering cycle. It achieves this by intercepting link clicks and executing navigation in an isolated and controlled manner. Pages are fetched over the wire using [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest) and the XHR (DOM String) responses are stored in browser state where they will remain until called upon. The fetching operations will execute preemptively, so when users navigate between different URL's (of the same hostname) the requested page DOM which results in web applications becoming these long running instances that function in an incremental manner.
