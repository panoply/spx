const purge = require('@fullhuman/postcss-purgecss')
const autoprefixer = require('autoprefixer')

module.exports = {
	plugins: [
    autoprefixer(),
    purge(
      {
        variables: true,
        content: [
          'public/**/*.html'
        ]
      }
    )
  ]
}
