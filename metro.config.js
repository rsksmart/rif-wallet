/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const path = require('path')

const defaultConfig = getDefaultConfig(__dirname)

// Define shims statically to avoid crashing before rn-nodeify runs
const extraNodeModules = {
  stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
  crypto: path.resolve(__dirname, 'node_modules/react-native-crypto'),
  buffer: path.resolve(__dirname, 'node_modules/buffer'),
  events: path.resolve(__dirname, 'node_modules/events'),
  process: path.resolve(__dirname, 'node_modules/process/browser.js'),
}

const config = {
  resolver: {
    extraNodeModules,
    resolveRequest: function packageExportsResolver(
      context,
      moduleImport,
      platform,
    ) {
      // Use the browser version of the package for React Native
      if (moduleImport === 'axios' || moduleImport.startsWith('axios/')) {
        return context.resolveRequest(
          {
            ...context,
            unstable_conditionNames: ['browser'],
          },
          moduleImport,
          platform,
        )
      }

      // Fall back to normal resolution
      return context.resolveRequest(context, moduleImport, platform)
    },
  },
  watchFolders: [path.resolve(__dirname, 'node_modules')],
}

module.exports = mergeConfig(defaultConfig, config)
