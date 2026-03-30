import { defineConfig, Options } from "tsup"

export default defineConfig((options: Options) => ({
  entry       : ["src/**/*.ts"],  // All source files
  format      : ["esm", "cjs"],   // Build both ESM and CommonJS
  dts         : true,             // Generate type declarations
  minify      : true,             // Minify output
  clean       : true,             // Clean dist before build
  external    : [],               // External deps (can add "react", etc.)
  splitting   : true,             // Enable code splitting for ESM
  treeshake   : true,             // Remove unused code
  sourcemap   : true,             // Generate source maps for debugging
  esbuildOptions(options) {
    // Customize esbuild directly
    options.keepNames = true  // Preserve function/class names
    options.platform = "browser" // Target browser environment
  },
  ...options
}))
