---
permalink: "/usage/vscode-extension/index.html"
title: "VSCode Extension"
layout: base.liquid
anchors:
  - VSCode Extension
  - Key Features
  - Workspace Settings
  - Usage
  - Example Project
---

# VSCode Extension

Developers using the [VSCode](https://code.visualstudio.com) text editor may like to take advantage of the official [SPX Extension](https://marketplace.visualstudio.com/items?itemName=sissel.vscode-spx). The extension will help improves the development experience with SPX and supports various capabilities designed to improve productivity an usage.

#### Key Features

- Syntax Highlighting for `spx-*` annotations in markup.
- SPX Specific Directive Completions with descriptions
- Event Directive Completions with MDN descriptions.
- Component Completions with state defined referencing.
- Supports grammar targeting for highlight customizations.

---

# Workspace Settings

The SPX extension contributes the following workspace settings:

<!-- prettier-ignore -->
```json
{
  "spx.enable": true,    // Enable/Disable SPX IntelliSense
  "spx.files": [],       // Provide a glob list of component file paths
  "spx.include": []      // Extend support to addition languages (default: html and liquid)
}
```

---

# Usage

Install the SPX extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=sissel.vscode-spx). By default, IntelliSense capabilities will work within `.html` and `.liquid` files, with all global directives available. For developers who are taking advantage of SPX Components, you can active and enable completion features by providing a glob path list within workspace settings.

:: row mt-4
:: col-12 col-md-6 pr-4 mb-5

#### Example Project

```treeview
 src/
  ├── app/
  │   └── components/
  └── package.json
```

::
:: col-12 col-md-6 pl-4 mb-5

#### Workspace Settings

<!-- prettier-ignore -->
```json
{
  "spx.files": [
    "./src/app/components/*.{ts,js}"
  ]
}
```

::
::
