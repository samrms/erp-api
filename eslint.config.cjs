module.exports = {
  plugins: { prettier: require("eslint-plugin-prettier") },
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": "off",
  },
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: { node: true },
  },
};
