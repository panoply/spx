const highlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const svgsprite = require('eleventy-plugin-svg-sprite');
const navigation = require('@11ty/eleventy-navigation');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const md = require('markdown-it');
const anchor = require('markdown-it-anchor');

/**
 * @type {import('./eleventy').LocalConfigFunction}
 */
module.exports = function (config) {

  const markdown = md({ html: true, breaks: true }).use(anchor);

  config.setBrowserSyncConfig({
    notify: false,
    files: [
      'public/style.css',
      'public/bundle.min.js'
    ]
  });

  config.setLibrary('md', markdown);
  config.addPlugin(navigation);
  config.addPlugin(highlight);
  config.addPlugin(svgsprite, {
    path: 'site/assets/svg',
    spriteConfig: {
      mode: {
        symbol: {
          inline: true,
          sprite: 'sprite.svg',
          example: false
        }
      },
      shape: {
        transform: [ 'svgo' ],
        id: {
          generator: 'svg-%s'
        }
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
      }
    }
  });

  config.addPlugin(htmlmin, {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    html5: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    sortAttributes: true,
    sortClassName: true
  });

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    templateFormats: [
      'liquid',
      'json',
      'md',
      'css',
      'html',
      'yaml'
    ],
    dir: {
      input: 'site',
      output: 'public',
      includes: 'views/include',
      layouts: 'views/layouts',
      data: 'data'
    }
  };

};
