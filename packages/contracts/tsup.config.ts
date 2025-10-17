import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false, // Disable DTS generation due to project configuration issues
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["zod"], // Mark Zod as external
});
