module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    // 'react-app',
    // 'plugin:testing-library/react',
    // 'plugin:jest-dom/recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:json/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', './src/'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
    'import/internal-regex':
      '^components/|^utils/|^actions/|^assets/|^core/|^api/|^reducers/|^types/',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    // 'react-hooks',
    // 'jest',
    'react',
    '@typescript-eslint',
    // 'jest-dom',
    'eslint-plugin-import',
    'prettier',
  ],
  ignorePatterns: ['**/node_modules', '**/.*/'],
  rules: {
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'utils/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/ban-types': ['warn'],
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref'],
      },
    ],
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'local',
        varsIgnorePattern: '^_',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn'],
    'no-console': 'error',
    'no-multiple-empty-lines': [
      // https://eslint.org/docs/rules/no-multiple-empty-lines
      'error',
      {
        max: 2,
        maxBOF: 0,
        maxEOF: 1,
      },
    ],
    'func-names': 'off',
    'react/forbid-dom-props': [
      'warn',
      {
        forbid: [
          {
            propName: 'style',
            message:
              'Avoid using inline styles, **which can break memoization and hurt performance**',
          },
        ],
      },
    ],
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
    'react/jsx-one-expression-per-line': 0,
  },
};
