---
permalink: '/key-concepts/index.html'
title: 'Key Concepts'
layout: base.liquid
anchors:
  - Key Concepts
  - Rendering Cycle
  - Fragments
  - Navigation
  - Prefetching
  - Morphing
  - Caching
---

# Key Concepts

Before using SPX, it is important to acquaint yourself with a few of its fundamental **key concepts** outlined on this page. Gaining familiarity with these concepts and understanding the approaches employed by SPX will allow you to better leverage the module in an effective manner and enable you to take advantage of its capabilities with more command.

# Rendering Cycle

SPX integrates into your web application and takes control of the rendering cycle. It achieves this by intercepting link clicks and executing navigation in an isolated and controlled manner. Pages are fetched over the wire using [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest) and the XHR (DOM String) responses are stored in browser state where they will remain until called upon.

There are several ways developers can optimize SPX and improve the speed of per-page visits. In its default state, the module applies the bare minimum in terms of preset configuration and optimization is encouraged. The quickest and easiest optimization tactic one can use is to define **Fragments** which persist across pages.

# Fragments

Fragments in SPX refer to elements annotated with an `id` attribute that persist across various pages of your website. These fragments serve as the dynamic components of your web application, as the descendant elements within them undergo changes between page visits. In contrast to static elements, which remain consistent across multiple visits, (dynamic) fragments represent the areas of your website that are subject to modification and consistent.

:::: grid row pt-3 pb-4
::: grid col-12 col-sm-6

<!-- prettier-ignore -->
```ts
import spx from 'spx';

spx({
  fragments: [
    'menu',  // <nav id="menu"></nav>
    'main'   // <div id="main"></div>
  ]
});
```

:::
::: grid mt-3 mt-sm-0 col-12 col-sm-6

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

In the provided example, we've specified two fragments that are anticipated to change: `menu` and `main`. These fragments are identified by their respective `id` attributes as per the entires supplied to `fragments` upon connection. Between visits, only the contents within these elements undergo replacements, or morphs, based on the updates received from the server or the directive annotation applied to link elements. This targeted approach aids in minimizing traversal operations when SPX swaps content, which brings us to the underlying method employed by SPX for replacing nodes.

# Navigation

SPX actively monitors events occurring on `<a>` elements within the DOM. This is the fundamental behavior of the module, as it revolves around link interception and navigational intent. When a user clicks on any link, SPX steps in to manage the navigation process. The link elements are essential to SPX, serving as representations of your web application routes and providing insights into the browsing intent of the end user.

> By default, SPX ensures that all link clicks follow its prescribed behavior based on annotations present on `<a>` elements. However, you have the flexibility to control the execution by using attributes to customize SPX's behavior on a per-page level. This way, you can fine-tune SPX to suit the specific needs of your web application.

<!-- prettier-ignore -->
```html
<!-- Disable SPX, when true a normal page visit ensues -->
<a spx-disable="true"></a>

<!-- Hover Prefetch, executes upon pointerover -->
<a spx-hover="true"></a>

<!-- Prefetch Proximity, executes when pointer is within x distance -->
<a spx-proximity="100"></a>

<!-- Intersection Prefetch, executes using Intersection Observer -->
<a spx-intersect="50"></a>

<!-- Position Control, controls Y and X scroll position -->
<a spx-position="y:0 x:0"></a>

<!-- Scroll Position, shorthand for spx-position -->
<a spx-scroll="0"></a>

<!-- Target Control, a list of selector elements to target -->
<a spx-target="#node"></a>

<!-- Cache Control, controls caching for the next navigation -->
<a spx-cache="false"></a>

<!-- History Control, controls history API for the next navigation -->
<a spx-history="replace"></a>

<!-- Prepend Control, prepend targets to one another in next navigation -->
<a spx-prepend="['#foo', '#bar']"></a>

<!-- Append Control, append targets to one another in next navigation -->
<a spx-append="['#foo', '#bar']"></a>

<!-- Threshold Limits, control the threshold timer -->
<a spx-threshold="250"></a>

<!-- Progress Control, whether or not to show a progress bar -->
<a spx-progress="false"></a>
```

# Prefetching

SPX supports prefetching tactics to proactively acquire page content over XHR in advance which significantly enhancing the navigation experience for end-users. This strategy is based on the concept of "intent to visit" where a user clicking on a link can be anticipated based on simple cursor analysis. Developers have access to varying methods to implement prefetching, all of which can be per-visit specific and controlled on a per-link basis.

By default, SPX initiates prefetches upon pointer hover events. However, recognizing that this may not suit all scenarios, SPX extends three additional prefetching methods. Developers can configure prefetching behaviors upon connection and have actions preset. Alternatively, you can customize prefetch execution on a per-link basis within the DOM using directives (attribute annotations) for more precise adjustment based on `href` importance or relevance.

:::: grid row pt-3 pb-4
::: grid col-12 col-md-6

<!-- prettier-ignore -->
```ts
spx({
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

:::
::: grid mt-3 mt-sm-0 col-12 col-md-6

<!-- prettier-ignore -->
```html

<!--
  Hover Prefetching
-->
<a spx-hover="true">Link</a>
<!--
  Intersection Prefetching
-->
<a spx-intersect="50">Link</a>
<!--
  Proximity Prefetching
-->
<a spx-proximity="1000">Link</a>
<!--
  Threshold Limits
-->
<a spx-threshold="500">Link</a>
```

:::
::::

# Morphing

DOM morphing is a technique employed by SPX to efficiently update the Document Object Model (DOM) when navigating between pages and replacing elements. Unlike traditional page loading methods, which often involve full-page reloads or re-rendering of entire DOM Tree, morphing focuses on selectively updating only the parts of the DOM that have changed. Below is a more detailed breakdown of the process and operations carried out under the hood.

> SPX uses a hard-forked variation of the [morph-dom](https://github.com/patrick-steele-idem/morphdom) algorithm written by [Patrick Steele-Idem](https://github.com/patrick-steele-idem/morphdom) which has been refined for usage and implementation into SPX.

<br>

#### 1. Traversal and Diffing

When a link is clicked, SPX will obtain the page snapshot from cache, parse it and then traverse two versions of the DOM (the current DOM and the new DOM). It then performs a "diffing" operation to compare these two DOM trees and identify the differences between them.

<br>

#### 2. Identifying Changes

Through the diffing process, SPX identifies which nodes have been added, removed, or modified between the two DOM states. This includes changes to attributes, text content, or the structure of the DOM tree.

<br>

#### 3. Selective Replacement

Once the differences are identified, SPX selectively applies changes to the DOM by replacing only the nodes that have been modified. This targeted approach ensures that unnecessary operations are avoided, leading to faster rendering times and improved performance.

<br>

#### 4. Incremental Updates

By applying changes incrementally, SPX minimizes the amount of work required to update the DOM, resulting in what is perceived as instantaneous renders when going from **Page A** to **Page B**.

<br>

#### 5. Real DOM Manipulation

Unlike virtual DOM libraries like React, which operate on a virtual representation of the DOM, SPX directly manipulates the real DOM. This means that changes are applied directly to the visible page, eliminating the need for additional abstraction layers and optimizing performance.

# Caching

SPX applies an in-memory cache to store varying models that describe an SPX session. The cache consists of DOM snapshots as raw strings, page specific rendering options, component instances and internal references. While this might raise concerns about performance, in situations where the cache may hold 100mb in browser state it's worth noting that SPX snapshots are relatively inexpensive in terms of memory usage and the module takes advantage of hashing mechanisms that adhere to `O(1)` time complexity where necessary. Below is a key breakdown of the SPX caching tactic.

<br>

#### 1. In-memory Cache

SPX incorporates an efficient in-memory cache to store fetched pages. After each visit, a snapshot of the raw DOM is saved as a string in the browser's local memory. Despite concerns about performance, SPX snapshots are relatively lightweight in terms of memory usage.

<br>

#### 2. Persistence of Snapshots

Each SPX snapshot (DOM String) remains accessible throughout an SPX session, preserving the state of visited pages. The cache remains available until a full page refresh occurs or the hostname changes, enabling seamless navigation within the session.

<br>

#### 3. Preemptive Cache Algorithm

SPX employs a preemptive cache algorithm, ensuring that visits are low-cost operations. Visits are executed asynchronously and sequentially, without blocking other tasks. Requests can be easily managed, including aborting, queuing, and prioritizing, which is particularly useful when multiple requests are awaiting processing.

<br>

#### 4. Efficient Resource Handling

SPX intelligently handles the execution of external resources like scripts and styles, contributing to a smooth browsing experience. It respects the execution order of these resources, ensuring seamless integration with cached visits.

<br>

#### 5. Enhancements with HistoryAPI

SPX utilizes the HistoryAPI `state` reference during cached visits, enhancing the efficiency of the caching mechanism. This further optimizes the browsing experience by leveraging browser history management capabilities.
