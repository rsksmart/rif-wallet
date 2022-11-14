module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:react/jsx-runtime'],
  rules: {
    semi: 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
  ignorePatterns: ['shim.js'],
}
