module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "koa",
    "airbnb-typescript-prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "import/prefer-default-export": 0,
    "no-console": 1,
    "no-underscore-dangle": 1
  },
};
