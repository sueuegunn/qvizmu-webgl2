import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'qvizmu-webgl2',
      fileName: 'qvizmu-webgl2',
      formats: ['es', 'cjs', 'umd'],
    },
  },
});
