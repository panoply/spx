const eleventy = require('@panoply/11ty');

module.exports = eleventy(function (config) {


  config.addPassthroughCopy({
    './node_modules/@brixtol/bootstrap/bootstrap.css': 'style.css'
  })

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '',
    templateFormats: [
      'liquid'
    ],
    dir: {
      input: '.',
      output: 'public',
      includes: 'cases/_include',
      layouts: 'cases/_pages',
      data: 'cases/_data'
    }
  };

});
