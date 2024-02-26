const eleventy = require('@panoply/11ty');
const papyrus = require('papyrus');
const container = require('markdown-it-container');
const { terser, sprite, versions, markdown } = require('@sissel/11ty');

/**
 * Papyrus Syntax
 *
 * Highlighting code blocks of markdown annotated regions of input.
 */
function syntax ({ raw, language }) {

  if (language === 'bash') {

    return papyrus.static(raw, {
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

    return papyrus.static(raw, {
      language,
      editor: false,
      showSpace: false,
      trimEnd: false,
      trimStart: false
    });

  }

  return papyrus.static(raw, {
    language,
    editor: false,
    showSpace: false,
    trimEnd: true,
    trimStart: true
  });

};

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


function navigate () {

}

/**
 * Eleventy Build
 *
 * Generates SPX Documentation
 */
module.exports = eleventy(function (config) {

  markdown(config, {
    syntax,
    options: {
      html: true,
      linkify: true,
      typographer: true,
      breaks: false,
    }
   })
  .use(container, 'tabs', { render: (tokens, idx) => tabs(markdown, tokens, idx) })
  .disable("code");

  config.addPlugin(versions, { version: require('../package.json').version });
  config.addPlugin(sprite, { inputPath: './src/assets/svg', spriteShortCode: 'sprite' });
  config.addPlugin(terser)

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '',
    templateFormats: [
      'liquid',
      'json',
      'md',
      'html',
      'yaml'
    ],
    dir: {
      input: 'src',
      output: 'public',
      includes: 'views/include',
      layouts: 'views/layout',
      data: 'data'
    },
  };
});
