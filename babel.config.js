module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      { useTransformReactJSXExperimental: true },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          src: './src',
          components: './src/components',
          shared: './src/shared',
          store: './src/redux',
          storage: './src/storage',
          navigation: './src/navigation',
          screens: './src/screens/',
          lib: './src/lib',
          core: './src/core',
          testLib: './testLib',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
}
