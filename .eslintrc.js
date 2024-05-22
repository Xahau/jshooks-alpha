// https://astexplorer.net/
// https://eslint.org/docs/latest/extend/selectors

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@jshooks-eslint-rules',
    '@typescript-eslint',
  ],
  ignorePatterns: [
    "@jshooks-eslint-rules/**",
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-restricted-globals': ['error',
      'setTimeout',
      'setInterval',
      'eval',
      'Promise',
      'Function',
    ],
    'no-restricted-syntax': ['error',
      // 'FunctionExpression',
      'WithStatement',
      'FunctionDeclaration',
      'CallExpression[callee.name="require"]',
      'CallExpression[callee.name="setTimeout"]',
      'CallExpression[callee.name="setInterval"]',
      'ImportDeclaration'
    ],
    '@typescript-eslint/no-unused-vars': ['error', { "varsIgnorePattern": "^Hook|Callback$" }],
    '@jshooks-eslint-rules/no-restricted-arrow-functions': 'error',
  },
}
