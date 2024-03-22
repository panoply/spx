---
permalink: '/misc/lexicon/index.html'
title: 'Lexicon'
layout: base.liquid
---

# Lexicon

The SPX Lexicon uses relative naming conventions to describe capabilities, features and usage. This page is a glossary of common SPX terminologies you'll come across in the documentation and when using the library in your project. Naming conventions are difficult and SPX appropriates familiar terminologies that developers or alternative frameworks/libraries use but there differences.

If you're coming from stimulus, you'll find that SPX refers to "controllers" as "components" or if you're coming from Alpine, you'll find that "directives" and not exclusive to all attributes, but only those which are component specific.

---

### Page

A **page** (or **pages**) in SPX refers to a specific location in your web application that SPX identifies via pathname. Pages are stored in browser state and exist as part of an SPX session.

<br>

### Snap

A **snap** (or **snapshot**) refers to a raw HTML string of a visited (fetched) page. Snapshots are stored in browser state and exist as part of an SPX session. When visiting a new location (page), SPX will retrieve the last known snapshot from the sessions cache and use it when rendering the page.

<br>

### Session

A **session** refers to a collection of data models which consist of varying references. The SPX session is a reference point used when performing visits to different locations, rendering pages and/or initialize components.

<br>

### Cache

The **cache** refers to references in the form of data models which have already been created and available in the SPX session. When a location is visited it cached and information about the specific location (page) is cached.

<br>

### Fragment

A **fragment** (or **fragments**) refers to DOM elements which are dynamic but consistent across a web application. A fragment may be an element such as `<main>` or one who's inner contents differs between visits.

<br>

### Target

A **target** (or **targets**) refers to DOM elements to target at specific locations. In some cases, you may want SPX to swap only certain elements other than those you've defined to be **fragments**.

<br>

### Directive

A **directive** refers to an attribute which is **component** related. Only a few attributes are component-specific in nature, we refer to those as directives.

<br>

### Attribute

An **attribute** (or **attributes**) refer to SPX annotated references applied to DOM elements.

<br>

### Node

A **node** (or **nodes**) is a **component** specific reference which describes a DOM element that uses the `spx-node` directive (attribute) and are made available to component contexts.

<br>

### Binding

A **bind** (or **binding**) is a **component** specific reference which describes a DOM element that uses the `spx-bind` directive (attribute). Elements annotated with `spx-bind` will reflect **state** values defined in a component.

<br>

### Eval

An **eval** (or **evaluation**) refers to an SPX **resource** which requires additional analysis.

<br>

### State

State refers to data models and can used to describe specific data management.

### Mount

A **mount** (or **unmount**) refers to a components render status. When a component is **mounted** it infers that it is active and present in the DOM. When a component is **unmounted** if infers that a components has established an instance but is currently not present in the DOM.

### Method

A **method** refers to a function which is made available to an instance. The instance is subjective, it may refer to a component instance, event or global instance.

### Event

An **event** refers to a callback executed following an operation (or task).

### Key

A **key** represents an identifier reference (depending on the context).
