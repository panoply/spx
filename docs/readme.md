# SPX Documentation

Documentation website for SPX (Single Page XHR). Built using [11ty](https://www.11ty.dev/docs/) and served up on [Netlify](https://netlify.com). The documentation is leveraging SPX so feel free to reference as a strap in your next project.

Visit the docs: [spx.js.org](https://spx.js.org)

### Supports

- Generated using 11ty
- SCSS to CSS Compilation with SASS Dart
- CSS Post Processing via PostCSS + CSSPurge
- TypeScript Transpilation using TSUP
- SVG Sprites with SVGO
- HTML Minification with HTML Terser
- Documentation Version generation

# Development

All dependencies are included within the `package.json` file. ESLint, Prettier and Stylelint is assumed to be installed globally but available as optional dependencies. Documentation is written in markdown and views are composed in Liquid. Frontmatter and JSON data files are used for the order of navigation and various other reference specific information.

### Commands

After installing, run `pnpm dev` to start in development mode. Documentation will build and be deployed via Github actions.

```cli
pnpm dev                 # Starts development in watch mode
pnpm stage               # Serve up via Netlify for staging
pnpm build               # Builds for production and applies version copy .zip
pnpm release             # Runs netlify build, generates sitemap and deploys
pnpm 11ty:build          # Triggers an 11ty build
pnpm 11ty:watch          # Starts 11ty in watch mode with server
pnpm sass:build          # Compiles SASS into CSS
pnpm sass:watch          # Start SASS in watch mode
pnpm ts:build            # Build production JS bundle
pnpm ts:watch            # Start ESBuild in watch mode
```

# Markdown Customizations

Markdown files will are processed using [markdown-it](https://github.com/markdown-it/markdown-it) and a couple of custom plugins. Frontmatter and JSON data files are used to the order of navigation and various other reference specific information.

- [Grid Container](#grid-container)
- [Rule Heading](#rule-heading)
- [Rule Showcase](#rule-showcase)

## Grid Container

Grid access is made possible using fenced containers in the markdown. The `grid` keyword along with quadruple `::::` or triple `:::` markers will result in content encapsulation in the output rendering. The [Brixtol Bootstrap](https://brixtol.github.io/bootstrap/) variation grid system and CSS framework class utilities are available and used for styling.

### INPUT

Take the following code structure in `.md` files:

```md
:: row jc-center ai-center

:: col-sm-6 col-md-4
Lorem ipsum dolor sit...
::

:: col-6 col-md-8
Lorem ipsum dolor sit...
::

::
```

### OUTPUT

The generated output result in `.html` files:

<!--prettier-ignore-->
```html
<div class="row jc-center ai-center">

  <div class="col-sm-6 col-md-4">
    Lorem ipsum dolor sit...
  </div>
  <div class="col-6 col-md-8">
    Lorem ipsum dolor sit...
  </div>
</div>
```

# License

Licensed under **[MIT](#LICENSE)**
