import { defineConfig } from 'tsup';

export default defineConfig({
  outDir: 'dist',
  sourcemap: 'inline',
  format: ['cjs', 'esm'],
  dts: true,
  keepNames: true,
  minify: false,
  skipNodeModulesBundle: true,
  shims: true,
  clean: true,
  entryPoints: ['src/index.ts', 'src/global.ts'],
});
