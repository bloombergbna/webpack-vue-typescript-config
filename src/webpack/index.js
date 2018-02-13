const baseConfig = require('./base-config')
const devConfig = require('./dev-config')
const prodConfig = require('./prod-config')
const testConfig = require('./test-config')
const styleLoaders = require('./style-loaders')

module.exports = {
  loaders: {
    styleLoaders,
  },
  buildBaseConfig: baseConfig.buildConfig,
  extractTextPlugin: baseConfig.extractPlugin,
  buildDevConfig: devConfig.buildConfig,
  createDevServer: devConfig.createDevServer,
  buildProdConfig: prodConfig.buildConfig,
  buildTestConfig: testConfig.buildConfig,
}