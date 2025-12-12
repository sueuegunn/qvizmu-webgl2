import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'sorb-webgl2',
      fileName: 'sorb-webgl2',
      formats: ['es', 'cjs', 'umd'],
    },
  },
});
