# CHANGELOG

### 21/12/2012 | v0.3.0-beta.1

##### Internal Improvements

Changes to some of the internal logic, specifically how state management is handled. Prior to this release the _store_ which held reference to snapshots and page state was using the native `Map` method. While nothing wrong with this approach, it felt better to leverage objects for `key > value` mapping because we constantly query the store. This version introduces a new helper utility for this internal operation leveraging a `null` prototype object reference. This helps improve the time it takes to query the store between navigations shaving around 30 to 70 milliseconds off the time it takes between fetches and becomes rather noticeable when a large cache exists.

In addition to the new state logic, a refactor an overhaul of the store handler. Previous version the store was wrapped in a `class` but JavaScript classes are fucked. The store is now just a collection of boring old functions. This refactor shaved some kb's of the total size of the project.

##### Hydrate Method

This is a new render method that will override defined `targets` which is helpful when you want to update specific fragments (elements) in the dom without replacing the main target fragments. This method updates the trigger page cache reference.

##### Anticipatory Caching

This version provides a preemptive fetches. There are 2 additions exposed in the version, which need a little more work but can be used. A new options for **reverse** caching is available which will execute a preemptive fetch of the previous page in the history stack when no snapshot exists in cache. Snapshot cache is purged if a browser refresh occurs and when navigating backwards or pages will need to be re-fetched resulting in minor delays if a refresh was triggered between browsing. By default, the last known previous page in the history stack is now fetched.

In addition to the reverse cache feature, a **preemptive** option is now available to the `prefetch` config. This option currently accepts a string list of paths only. Values defined here will be fetched preemptively and saved to cache either upon initial load and those pages will be visited in background asynchronously in the order they were passed. In the next release preemptive fetches will be made possible according to a specific path.

##### Methods

In previous version of the beta some exposed methods were not available or working properly. This release fixes them and introduces a new `Pjax.reload()` method which will trigger a fetch and re-cache of a page, while preserving scroll position. Some other fixes and updates made in this area include:

- The `Pjax.cache(url?:string)` method will return page cache
- The `Pjax.visit(url: string, state?: IPage)` method can digest `hydrate`
- The `Pjax.clear(url?:string)` method was update to work with new store approach.

##### Full List

Below is a the complete list of changes applied in this release

- Fixed scroll position preservation between no-cached navigations
- Promise methods resolve page state correctly.
- Improved `<head>` node replacements between navigations.
- Replaced how fragments are replaced between visits.
- Added a hydration support for partial replacements
- Overhauled the store engine
- Clean up various other areas.

#### 10/08/2021 | v0.2.0-beta.1

- Convert to TypeScript
- Fix Circular Dependencies
- Remove development code
- Remove Babel logic, rely upon TS for transpilation.
- Fixed definition file
- Drop ES5 support, this is now a modern JavaScript module (ie: fuck boomers)

#### 31/03/2021 | v0.1.3-beta.1

- Tidy up code base
- Add in support for all events

#### 30/03/2021 | v0.1.2-beta.1

- Fix some type definitions
- Update Readme to to accurate description

#### 30/03/2021 | v0.1.1-beta.1

- Fixes Prefetch hover toggle between navigation
- Update Readme typos + other stuff.

#### 29/03/2021 | v0.1.0-beta.1

Initial Release
