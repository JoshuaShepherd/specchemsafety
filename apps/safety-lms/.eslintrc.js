module.exports = {
  extends: ["next/core-web-vitals"],
  env: {
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: [".next/", "node_modules/"],
};
