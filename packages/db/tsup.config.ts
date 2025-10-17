import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["drizzle-orm", "drizzle-orm/pg-core", "postgres"], // Mark DB dependencies as external
});
