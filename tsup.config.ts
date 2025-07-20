import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  outDir: "dist",
  target: "node18",
  dts: true, // Generate declaration files
  clean: true, // Clean dist before each build
  splitting: false, // No code splitting needed for CLI
  sourcemap: false,
  minify: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
