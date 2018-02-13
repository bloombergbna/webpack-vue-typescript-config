const path = require('path')
const webpack = require('webpack')
const isProduction = process.env.NODE_ENV === 'production'
const styleLoaders = require('./style-loaders')
const tsLoaderConfig = require('./ts-loader-config')
const vueLoaderConfig = require('./vue-loader-config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

exports = module.exports = {}

exports.extractPlugin = undefined

if (isProduction) {
  exports.extractPlugin = new ExtractTextPlugin({
    filename: '[name]-[contenthash].css',
    allChunks: true,
  })
}

exports.buildConfig = function(projectRoot, entry, outputDir, extractPlugin) {
  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${isProduction ? "production" : 'development'}"`
      }
    }), 
    new HappyPack({
      id: 'typescript',
      threadPool: happyThreadPool,
      loaders: tsLoaderConfig.tsLoaderStack,
    }),
    new HappyPack({
      id: 'vue',
      threadPool: happyThreadPool,
      loaders: [{
        loader: 'vue-loader',
        options: vueLoaderConfig
      }]
    }),
    new ForkTsCheckerWebpackPlugin({
      ignore: /node_modules/,
      vue: true,
      async: false,
      formatter: tsLoaderConfig.typeCheckErrorFormatter
    }),
  ]

  let extract = extractPlugin || exports.extractPlugin
  if (extract) {
    plugins.push(extract)
  }

  return {
    entry: entry,
    output: {
      filename: "[name].js",
      chunkFilename: '[name].js',
      pathinfo: true,
      path: outputDir,
    },

    target: "web",

    module: {
      rules: [{
          test: /\.tsx?$/,
          // use: 'happypack/loader?id=typescript',
          use: tsLoaderConfig.tsLoaderStack,
          exclude: /node_modules/,
        }, {
          test: /\.vue$/,
          // use: 'happypack/loader?id=vue',
          use: [{
            loader: 'vue-loader',
            options: vueLoaderConfig
          }],
        }, {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
          }]
        }, {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: path.join(outputDir, 'img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: path.join(outputDir, 'media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: path.join(outputDir, 'fonts/[name].[hash:7].[ext]')
          }
        }
      ].concat(styleLoaders.styleLoaders({extract: isProduction}))
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
      plugins: [
        new webpack.WatchIgnorePlugin([
          /\.d\.ts$/
        ]),
      ],
      alias: {
        '@': path.resolve(projectRoot, 'src'),
      }
    },
    resolveLoader: {
      modules: [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(__dirname, '../../node_modules'),
      ]
    }, 
    plugins,
  }
}