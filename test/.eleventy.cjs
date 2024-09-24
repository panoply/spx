const { eleventy, sprite, markdown } = require('e11ty');

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

  config.addPlugin(sprite, { inputPath: './asset/svg', spriteShortCode: 'sprite' });
  config.addShortcode('iframe', function (url, height = 180) {
    return `<iframe src="${url}" class="bd rd-3 w-100 my-3" height="${height}px"></iframe>`;
  });

  config.addPassthroughCopy({ 'asset/fonts/': 'asset/fonts/' });

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
