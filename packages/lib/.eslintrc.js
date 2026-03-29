/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignorePatterns: [
    "*.js",
    "*.d.ts",
    "*.d.ts.map",
    "node_modules/",
    "dist/",
    "build/",
  ],
};
