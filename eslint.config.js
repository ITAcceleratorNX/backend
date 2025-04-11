import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    ignores: ["node_modules", "dist", "coverage"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        next: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },
  },
]);
