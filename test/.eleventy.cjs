const { eleventy, markdown } = require('e11ty');

module.exports = eleventy(function (config) {

  markdown(config, {
    papyrus: {
      default: {
        lineNumbers: true
      }
    },
    options: {
      html: false,
      breaks: true,
      linkify: true
    }
  });

  config.addShortcode('iframe', function (url, height = 180) {
    return `<iframe src="${url}" class="bd rd-3 w-100 my-3" height="${height}px"></iframe>`;
  });

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '',
    templateFormats: [
      'liquid',
      'html',
      'md'
    ],
    dir: {
      input: '.',
      output: 'public',
      includes: '',
      layouts: ''
    }
  };

});
