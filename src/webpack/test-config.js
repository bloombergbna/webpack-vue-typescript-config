const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')

module.exports.buildConfig = function(baseConfig) {
  return merge(baseConfig, {
    devtool: 'inline-cheap-module-source-map',

    // Needed for IDE debugging
    output: {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    }
  })
}
