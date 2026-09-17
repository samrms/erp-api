module.exports = {
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: { node: true },
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
};
