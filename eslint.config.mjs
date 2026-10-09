import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "public/",
    "resources/",
    "static/",
    // outdated compile output of the .ts files next to them, not used by the site
    "assets/ts/*.js",
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/postcss.config.js"],
    languageOptions: { sourceType: "commonjs" },
  },
);
