---
title: 'Component Incremental'
layout: cases/component-incremental/index.liquid
permalink: '/components/incremental/index.html'
---

The test case is for incremental handling of a component. Incremental support in SPX occurs when a mounted component that is persisted outside of a defined fragment or specific target has additional nodes or events associated to the instance in an incremental manner. The below component is mounted, but **Page A**, **Page B** and **Page C** are targeting elements outside of its mount point. The intention here is to ensure that we can attach events and extend functionality to nodes while the component persists between navigations.

---
