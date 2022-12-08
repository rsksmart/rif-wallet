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
    'react-hooks/exhaustive-deps': 'error',
    'no-undef': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-empty-function': 'off',
  },
  overrides: [
    {
      files: ['src/lib/**/*.ts', 'src/lib/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  ignorePatterns: ['shim.js'],
}
