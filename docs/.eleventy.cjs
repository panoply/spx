const highlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const svgsprite = require("eleventy-plugin-svg-sprite");

/**
 * @param {import('./types/11ty').EleventyConfig} config
 */
module.exports = function (config) {


  config.addPlugin(highlight)
  config.addPassthroughCopy('site/CNAME')
  config.setBrowserSyncConfig({ notify: true });
  config.addPlugin(svgsprite, {
    path: 'site/assets/svg',
    spriteConfig: {
      mode: {
        symbol: {
          inline: true,
          sprite: 'sprite.svg',
          example: false,
        },
      },
      shape: {
        transform: ['svgo'],
        id: {
          generator: 'svg-%s',
        },
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false,
      },
    }
  });

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: true,
    templateFormats: [
      'liquid',
      'json',
      'md',
      'css',
      'html',
      'yaml'
    ],
    dir: {
      input: "site",
      output: "public",
      includes: "includes",
      //collections: "pages",
      layouts: "",
      data: "data"
    }
  };
};
