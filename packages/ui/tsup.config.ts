import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  // Watch specific paths (e.g., all TypeScript files in src directory)
  watch: options.watch ? ["src/**/*.ts", "src/**/*.tsx"] : undefined,
  minify: !options.watch,
}));
