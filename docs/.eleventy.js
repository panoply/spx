const eleventy = require('@panoply/11ty');
const svgsprite = require('eleventy-plugin-svg-sprite');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const md = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const anchor = require('markdown-it-anchor');
//const { sorting, prism } = require('./scripts/plugins.cjs');
const papyrus = require('papyrus')

function highlighter (md, raw, language) {

  let code = '';


  if (language) {

    if(language === 'json:rules') return raw;

    try {


      code = papyrus.create(raw, {
        language,
        trimStart: true,
        trimEnd: true,
        insertPreElement: true,
        lineNumbers: true,
        spellcheck: false,
        indentSize: 2,
        editor: false
      });




    } catch (err) {

      code = md.utils.escapeHtml(raw);

      console.error(
        'HIGHLIGHTER ERROR\n',
        'LANGUAGE: ' + language + '\n\n', err);
    }

  } else {
    code = md.utils.escapeHtml(raw);
    input = md.utils.escapeHtml(raw);
  }


  return code

};

/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function notes (tokens, index) {

  return tokens[index].nesting === 1 ? `<blockquote class="note">` : '</blockquote>'

}

/**
 * @type {import('./eleventy').LocalConfigFunction}
 */
module.exports = eleventy(function (config) {

  const markdown = md({
    html: true,
    highlight: (str, lang) => highlighter(markdown, str, lang)
   })
    .use(anchor)
    .use(mdcontainer, 'note', { render: notes })
    .disable("code");

    config.addPassthroughCopy('./site/assets/img/**')
  config.addLiquidShortcode('version', () => require('../package.json').version)
  config.setBrowserSyncConfig();
  config.setLibrary('md', markdown);
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
    collapseBooleanAttributes: false,
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
    markdownTemplateEngine: false,
    pathPrefix: '',
    templateFormats: [
      'liquid',
      'json',
      'md'
    ],
    dir: {
      input: 'site',
      output: 'public',
      includes: 'views/include',
      layouts: 'views/layouts',
      data: 'data'
    }
  };

});
