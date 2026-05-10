module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'playwright', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Page Object Model encapsulates assertions inside `verify*` helpers,
    // and tests organize them under `test.step()` callbacks; the upstream
    // rule does not traverse into those callbacks reliably, so this is
    // turned off to avoid false positives.
    'playwright/expect-expect': 'off',
    'playwright/no-conditional-in-test': 'off',
    'playwright/no-skipped-test': 'warn',
    'playwright/no-wait-for-timeout': 'off',
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
  },
  ignorePatterns: [
    'node_modules/',
    'playwright-report/',
    'test-results/',
    'dist/',
    'allure-results/',
    'allure-report/',
    '*.js',
  ],
};
