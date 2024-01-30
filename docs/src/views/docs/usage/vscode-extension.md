---
title: 'VSCode Extension'
layout: base.liquid
permalink: '/usage/vscode-extension/index.html'
prev:
  label: 'Options'
  uri: '/usage/options'
next:
  label: 'Methods'
  uri: '/methods/'
---

# VSCode Extension

Developers using the [VSCode](https://code.visualstudio.com) text editor can install the [SPX Extension](https://marketplace.visualstudio.com/items?itemName=sissel.vscode-spx). The VSCode extension improves the development experience with SPX and supports various capabilities designed to improve productivity.

### Key Features

- Syntax Highlighting
- Completions and Validations
- Linked Referencing

# Workspace Settings

The SPX extension contributes the following workspace settings:

<!-- prettier-ignore -->
```json
{
  "spx.filePaths": [
    "**/*.{ts}",
    "**/*.{liquid}"
  ],
  "spx.tokenColors": {
    "characters": {
      "color": "#000",
      "fontStyle": "italic"
    },
    "events": {
      "color": "#000",
      "fontStyle": "italic"
    },
    "schema": {
      "color": "#000",
      "fontStyle": "italic"
    },
    "identifiers": {
      "color": "#000",
      "fontStyle": "italic"
    }
  }
}
```
