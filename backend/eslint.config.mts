// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // 1) Ignore build artifacts
  { ignores: ["dist/**", "node_modules/**"] },

  // 2) Base JS rules
  js.configs.recommended,

  // 3) TypeScript rules (no type-checking needed)
  ...tseslint.configs.recommended,

  // 4) Node env + a few sensible tweaks
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // TS already handles undefined vars; disable the JS rule
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
    },
  },
];
