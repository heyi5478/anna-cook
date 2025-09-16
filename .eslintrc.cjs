module.exports = {
  root: true,
  env: {
    browser: true,
    jest: true,
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:storybook/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-restricted-exports': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'global-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-import-module-exports': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'no-console': 0,
    'react/prop-types': 0,
    'react/button-has-type': 0,
    'react/function-component-definition': 0,
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'max-len': [
      'error',
      { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true },
    ],
  },
};
