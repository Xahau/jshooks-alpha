module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ["*.d.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
  rules: {
    'no-restricted-globals': ['error',
      'setTimeout',
      'setInterval',
      'eval',
      'Promise',
    ],
    'no-restricted-syntax': ['error',
      'WithStatement',
      'CallExpression[callee.name="setTimeout"]',
      'CallExpression[callee.name="setInterval"]'
    ],
    // 'no-redeclare': 'off',
    // 'no-restricted-imports': 'off',
  },
}
