module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    '@typescript-eslint',
    'eslint-plugin-react',
    'eslint-plugin-import',
    'react-hooks',
    'react-native',
  ],
  rules: {
    semi: 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  ignorePatterns: ['shim.js'],
}
