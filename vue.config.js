const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    output: {
      hashFunction: 'md5'
    }
  },

  pluginOptions: {
    electronBuilder: {
      // 🔥 مهم جداً: يمنع تمرير legacy flags
      nodeIntegration: true,

      chainWebpackMainProcess: (config) => {
        config.output.hashFunction('md5')
      },

      // 🔥 هذا هو الحل الحاسم
      mainProcessArgs: [],

      builderOptions: {
        win: {
          icon: 'public/logogth.ico',
          requestedExecutionLevel: 'asInvoker'
        },
        extraResources: [
          {
            from: path.resolve(__dirname, 'backend/'),
            to: 'backend',
            filter: ['**/*']
          }
        ]
      }
    }
  }
})