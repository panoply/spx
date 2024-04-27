---
title: 'spx-fragment'
layout: base.liquid
group: 'directive'
permalink: '/directives/spx-fragment/index.html'
---

# spx-fragment

The `spx-fragment` directive attribute allows you to mark elements as fragments directly within the DOM, rather than defining them upon SPX connection using the `fragments[]` option. When employing the `spx-fragment` directive, it's essential to provide either a unique `id` value or a distinct string identifier. Failure to provide a unique identifier will prompt SPX to raise an error.

> Remember, when using the `spx-fragment` directive, uniqueness is key. If no value is provided or a boolean `true` is passed, SPX will search for an existing `id` attribute on the annotated element. If neither is found, SPX will issue a warning, and no actions or operations will be applied to the element during page transitions.

---

# Practical Application

The `spx-fragment` directive is helpful in scenarios where certain elements must be dynamically defined, yet explicit identifier values cannot be passed during connection. This directive also comes in handy when components extend third-party packages and modify the DOM structure.

<br>

#### Example 1

Below we are passing a unique id to `spx-fragment`

{% raw %}

```liquid
{% for item in collection.items %}
  <div
    spx-fragment="demo-{{ forloop.index }}">
    ...
  </div>
{% endfor %}
```

{% endraw %}

<br>

#### Example 2

Below we signaling to SPX to use the `id=""` value as the fragment identifier

{% raw %}

```liquid
{% for item in collection.items %}
  <div
    id="demo-{{ forloop.index }}"
    spx-fragment="true">
    ...
  </div>
{% endfor %}
```

{% endraw %}
