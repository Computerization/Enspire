module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/essential",
    "@vue/typescript",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  rules: {
    "no-undef": "off", // covered by typescript
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prefer-const": [
      "error",
      { destructuring: "any", ignoreReadBeforeAssign: true },
    ],
  },
};
