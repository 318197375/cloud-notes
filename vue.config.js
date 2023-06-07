const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = defineConfig( {
  chainWebpack: config => {
    config.resolve.alias
      .set('@css', resolve('src/assets/css'))
      .set('@images', resolve('src/assets/images'))
  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    open: true
  },

  transpileDependencies: true,
  lintOnSave: false
})
