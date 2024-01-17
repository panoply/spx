const eleventy = require('@panoply/11ty');
const svgsprite = require('eleventy-plugin-svg-sprite');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const md = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const anchor = require('markdown-it-anchor');
const papyrus = require('papyrus')
const fs = require('node:fs')
const { join } = require('node:path');
const { cwd } = require('node:process');

function highlighter (md, raw, language) {

  let code = '';


  if (language) {

    try {

     if (language === 'bash') {


      code = papyrus.static(raw, {
        language,
        editor: false,
        showSpace: false,
        showTab: false,
        showCR: false,
        showLF: false,
        showCRLF: false,
        lineNumbers: false
      })

    } else if (language === 'treeview') {

      code = papyrus.static(raw, {
        language,
        editor: false,
        showSpace: false,
        trimEnd: false,
        trimStart: false
      });

    } else {

      code = papyrus.static(raw, {
        language,
        editor: false,
        showSpace: false,
        trimEnd: true,
        trimStart: true
      });

    }



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
 * Sugar helper for generating markup. Just a simple `.join('')`
 * utility
 *
 * @param {string[]} lines
 * @returns {string}
 */
function string (lines) {

  return lines.join('')

}


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


function tabs(md, tokens, idx) {

  if(tokens[idx].nesting === 1) {

    const col = tokens[idx].info.trim().match(/^tabs\s+(.*)$/);

    if (col !== null) {

      // opening tag
      return col[1] ==='template' ? string([
        /* html */`
        <div spx-component="tabs">
          <div class="row gx-0 bd tabs py-2 px-2">
            <div class="col-auto mr-2">
              <button
                type="button"
                class="btn upcase tab active"
                data-index="0"
                spx-node="tabs.btn"
                spx@click="tabs.toggle">
                Template
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn upcase tab"
                data-index="1"
                spx-node="tabs.btn"
                spx@click="tabs.toggle">
                Component
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn upcase tab"
                data-index="1"
                spx-node="tabs.btn"
                spx@click="tabs.toggle">
                Example
              </button>
            </div>
          </div>
          <div class="col-12 tab-content" spx-node="tabs.tab">
        `,
      ]) : string([
        /* html */`
          <div class="col-12 tab-content d-none" spx-node="tabs.tab">
        `
      ])
    }
   }



  return '</div>'


}


/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function grid(md, tokens, idx) {

  if(tokens[idx].nesting === 1) {

   var col = tokens[idx].info.trim().match(/^grid\s+(.*)$/);

   if (col !== null) {

     // opening tag
     return [

       /* html */`
       <div class="${md.utils.escapeHtml(col[1])}">
       `
     ].join('')
   }


  }

   return '</div>'

 }

function versions ()  {

  return fs.readdirSync(join(cwd(), 'version'))
  .filter(v => v !== '.DS_Store')
  .map(version => {
   const v = version.replace(/\.zip/, '')
   return `<li><a href="/v/${v}/">${v.replace(/-beta/, ' (beta)')}</a></li>`
  }).join('')

}


/**
 * @type {import('./eleventy').LocalConfigFunction}
 */
module.exports = eleventy(function (config) {

  const markdown = md({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    highlight: (str, lang) => highlighter(markdown, str, lang)
   })
    .use(anchor)
    .use(mdcontainer, 'tabs', { render: (tokens, idx) => tabs(markdown, tokens, idx) })
    .use(mdcontainer, 'note', { render: notes })
    .use(mdcontainer, 'grid', { render: (tokens, idx) => grid(markdown, tokens, idx) })
    .disable("code");

  config.addPassthroughCopy('./src/assets/img/**')
  config.addLiquidShortcode('version', () => require('../package.json').version)
  config.addLiquidShortcode('versions', () => versions());
  config.setLibrary('md', markdown);
  config.addPlugin(svgsprite, {
    path: 'src/assets/svg',
    spriteConfig: {
      mode: {
        symbol: {
          inline: true,
          sprite: 'sprite.svg',
          example: false
        }
      },
      shape: {
        transform: ['svgo'],
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

  if(process.env.ENV ==='prod') {
    config.addPlugin(htmlmin, {
      collapseBooleanAttributes: false,
      collapseWhitespace: true,
      decodeEntities: true,
      html5: true,
      removeAttributeQuotes: false,
      removeComments: true,
      removeOptionalTags: false,
      sortAttributes: true,
      sortClassName: true
    });
  }

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '',
    templateFormats: ['liquid', 'json', 'md', 'css', 'html', 'yaml'],
    dir: {
      input: 'src',
      output: 'public',
      includes: 'views/include',
      layouts: 'views/layout',
      data: 'data'
    },
  };
});
