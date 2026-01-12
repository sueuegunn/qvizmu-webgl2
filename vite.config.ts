import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'quvysm-webgl2',
      fileName: 'quvysm-webgl2',
      formats: ['es', 'cjs', 'umd'],
    },
  },
});
