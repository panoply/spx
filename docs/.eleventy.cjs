const eleventy = require('@panoply/11ty');
const papyrus = require('papyrus');
const container = require('markdown-it-container');
const attrs = require('markdown-it-attrs');
const anchor = require('markdown-it-anchor');
const { terser, sprite, versions, markdown } = require('@sissel/11ty');
const { readFile, writeFile } = require('node:fs/promises');
const { marked } = require('marked');
const matter = require('gray-matter')

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
      return col[1] === 'template' ? [
        /* html */`
        <div spx-component="tabs">
          <div class="row gx-0 bd tabs py-2 px-2">
            <div class="col-auto mr-2">
              <button
                type="button"
                class="btn upper tab active"
                spx-node="tabs.button"
                spx@click="tabs.toggle"
                spx-tabs:index="0">
                Template
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn upper tab"
                spx-node="tabs.button"
                spx@click="tabs.toggle"
                spx-tabs:index="1">
                Component
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn upper tab"
                spx-node="tabs.button"
                spx@click="tabs.toggle"
                spx-tabs:index="2">
                Example
              </button>
            </div>
          </div>
          <div class="col-12 tab-content" spx-node="tabs.panel">
        `,
      ].join('') : [
        /* html */`
          <div class="col-12 tab-content d-none" spx-node="tabs.panel">
        `
      ].join('')
    }
   }



  return '</div>'


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
      breaks: false
    },
   })
  .use(anchor, { callback: token =>  token.attrs.push(['spx-node', 'scrollspy.anchor']) })
  .use(container, 'tabs', { render: (tokens, idx) => tabs(markdown, tokens, idx) })
  .use(attrs)
  .disable("code");

  let page = [];

  config.addLiquidShortcode('search', async function(content) {

    const read = await readFile(this.page.inputPath)
    const parse = marked.lexer(read.toString())
    const frontmatter = parse[0].type === 'hr'
      ? parse.splice(0, 2).map(({ raw }) => raw).join('\n')
      : null

    let data;

    if(frontmatter !== null) {
     data = matter(frontmatter).data
    }

    let heading = ''

    const records = new Map();

    parse.forEach(token => {
      if(token.text && token.text.length > 0) {
        if(token.type === 'heading' ) {
          if(token.text.toLowerCase().includes('acknowledgements')) return
          heading = token.text.replace(/[`_*]/g, '')
          if(!records.has(heading)) records.set(heading, [])
        } else if (token.type === 'paragraph') {
          if(!/^({{|{%|<[a-z]|:::)/.test(token.text) && heading) {
            records.get(heading).push(
              token.text
              .replace(/[`_*]/g, '')
              .replace(/\[([a-z].*?)\]\(.*?\)/g, '$1')
            )
          }
        }
      }
    })

    if(records.size > 0) {
      for (const [ heading, content ] of records) {
        page.push({
          title: data.title,
          heading,
          content: content.join(' '),
          url: this.page.url.slice(0, -1)
        })
      }
    }
  })

  config.on('eleventy.after', async () => {
    if(page.length > 0) {
      const content = JSON.stringify(page, null, 2)
      await writeFile('./public/spx.json', content)
    }
  })

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
      data: 'data',
    },
  };
});
