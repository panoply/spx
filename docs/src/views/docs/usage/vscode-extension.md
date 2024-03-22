---
permalink: '/usage/vscode-extension/index.html'
title: 'VSCode Extension'
layout: base.liquid
---

# VSCode Extension

Developers using the [VSCode](https://code.visualstudio.com) text editor may like to take advantage of the official [SPX Extension](https://marketplace.visualstudio.com/items?itemName=sissel.vscode-spx). The extension will help improves the development experience with SPX and supports various capabilities designed to improve productivity an usage.

<br>

# Key Features

- Syntax Highlighting for `spx-*` annotations in markup.
- Supports grammar targeting for highlight customizations.
- SPX Specific Directive Completions with descriptions
- Event Directive Completions with MDN descriptions.
- Component Completions with state defined referencing.

<br>

# Workspace Settings

The SPX extension contributes the following workspace settings:

<!-- prettier-ignore -->
```json
{
  "spx.completions": true,    // Enable/Disable Directive Completions
  "spx.validations": true     // Enable/Disable Validation Diagnostics
}
```
