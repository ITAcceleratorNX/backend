import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    ignores: ["coverage/**", "node_modules/**", "dist/**"], // МІНДЕТТІ түрде **/** жазу керек
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        next: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        test: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
        document: "readonly",
        window: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
      },
    },
  },
]);
