// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

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
  },
  watchFolders: [path.resolve(__dirname, 'node_modules')],
}

module.exports = mergeConfig(defaultConfig, config)
