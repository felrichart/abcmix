import js from '@eslint/js'
import prettier from 'eslint-config-prettier/flat'
import typescript from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript.plugin,
    },
    rules: {
// --- GENERAL RULES ---
      'prefer-promise-reject-errors': 'off',
      quotes: ['warn', 'single', { avoidEscape: true }],
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      // https://eslint.org/docs/latest/rules/no-eval
      'no-eval': 'error',
      // https://eslint.org/docs/latest/rules/no-implied-eval
      'no-implied-eval': 'error',

      // https://eslint.org/docs/latest/rules/no-undef#handled_by_typescript
      'no-undef': 'off',

      // --- TYPESCRIPT RULES ---
      // this rule, if on, would require explicit return type on the `render` function
      '@typescript-eslint/explicit-function-return-type': 'off',

      /* in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule,
       * so it has to be disabled */
      '@typescript-eslint/no-var-requires': 'off',

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': ['warn', { allowTernary: true }],
    },
  },
]
