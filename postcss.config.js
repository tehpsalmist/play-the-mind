const purgecss = require('@fullhuman/postcss-purgecss')
const { NODE_ENV } = process.env
const productionPlugins = NODE_ENV === 'production'
  ? [
    purgecss({ content: ['./index.html', './src/**/*.js'], whitelistPatterns: [/partner-animation-\d-\d/] })
  ]
  : []

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...productionPlugins
  ]
}
