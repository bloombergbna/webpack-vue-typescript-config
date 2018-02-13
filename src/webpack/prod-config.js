const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./base-config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const ANALYZE = !!process.env.ANALYZE

module.exports.buildConfig = function(baseConfig, externalizeNodeModules = true) {
  let config = merge(baseConfig, {
    externals: externalizeNodeModules ? [ nodeExternals() ] : undefined,

    devtool: "source-map",

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }), 
      new webpack.NoEmitOnErrorsPlugin(),
      new FriendlyErrorsPlugin(),
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          // Compression offers very little improvement
          // to code size and increases time significantly
          compress: false,
        },
      }),
    ]
  })

  if (ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true,
      logLevel: 'silent'
    }))
  }
}