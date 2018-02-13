const tsLoaderStack = require("./ts-loader-config").tsLoaderStack
const rawLoaders = require("./style-loaders").rawLoaders

const isProduction = process.env.NODE_ENV === 'production'

const loaders = Object.assign({},
  rawLoaders({
    sourceMap: true,
    extract: isProduction
  }),
  {
    ts: tsLoaderStack
  }
)

module.exports = {
  loaders: loaders,
  cssSourceMap: true,
  hotReload: !isProduction,
  extractCSS: isProduction,
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}