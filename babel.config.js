module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      { useTransformReactJSXExperimental: true },
    ],
  ],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
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
          navigation: './src/navigation',
          screens: './src/screens/',
          lib: './src/lib',
        },
      },
    ],
  ],
}
