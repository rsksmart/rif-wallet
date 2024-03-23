module.exports = {
  root: true,
  extends: [
    '@react-native',
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
    'import/order': [
      'error',
      {
        groups: [
          'external',
          'builtin',
          'internal',
          ['sibling', 'parent'],
          'index',
        ],
        pathGroups: [
          {
            pattern: 'lib/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'src/**',
            group: 'internal',
          },
          {
            pattern: 'components/**',
            group: 'internal',
          },
          {
            pattern: 'shared/**',
            group: 'internal',
          },
          {
            pattern: 'store/**',
            group: 'internal',
          },
          {
            pattern: 'storage/**',
            group: 'internal',
          },
          {
            pattern: 'navigation/**',
            group: 'internal',
          },
          {
            pattern: 'screens/**',
            group: 'internal',
          },
          {
            pattern: 'core/**',
            group: 'internal',
          },
          {
            pattern: 'testLib/**',
            group: 'internal',
          },
        ],
        'newlines-between': 'always',
        warnOnUnassignedImports: true,
        pathGroupsExcludedImportTypes: [],
      },
    ],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
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
