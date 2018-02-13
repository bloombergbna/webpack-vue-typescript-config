const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.rawLoaders = function(options) {
  options = options || {}

  let defaultOptions = {
    sourceMap: true,
    extract: false
  }

  options = Object.assign({}, defaultOptions, options)

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath: '/assets/'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    scss: generateLoaders('sass'),
  }
}

// Generate loaders for standalone use outside of .vue files
exports.styleLoaders = function(options) {
  const output = []
  const loaders = exports.rawLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}