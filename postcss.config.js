// const purgecss = require('@fullhuman/postcss-purgecss')
// const { DEV } = process.env

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
    // purgecss({
    //   content: ['./index.html', './src/**/*.js']
    // })
  ]
}
