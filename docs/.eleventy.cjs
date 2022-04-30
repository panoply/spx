const highlight = require("@11ty/eleventy-plugin-syntaxhighlight");

/**
 * @param {import('./types/11ty').EleventyConfig} config
 */
module.exports = function (config) {


  config.addPlugin(highlight)
  config.addPassthroughCopy('site/CNAME')
  config.setBrowserSyncConfig({ notify: true });

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
