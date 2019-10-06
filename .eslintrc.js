module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  settings: {
    react: {
      pragma: "h",
      version: require("preact/compat").version,
    },
  },
  rules: {
    "react/prop-types": "off",
    "no-empty": ["error", { allowEmptyCatch: true }],
  },
};
