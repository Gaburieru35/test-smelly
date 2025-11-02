import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...jestPlugin.environments.globals.globals,
        node: true,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,
      "jest/no-disabled-tests": "warn",
      "jest/no-conditional-expect": "error",
      "jest/no-identical-title": "error",
    },
  },
];