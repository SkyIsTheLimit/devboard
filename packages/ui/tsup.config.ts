import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  // Watch specific paths (e.g., all TypeScript files in src directory)
  watch: ["src/**/*.ts", "src/**/*.tsx"],
});
