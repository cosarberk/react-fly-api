import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts', 
      name: 'react-fly-api', 
      fileName: (format: any) => `react-fly-api.${format}.js`, 
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react','react-dom', 'react-query', 'axios'], 
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tanstack/react-query': 'ReactQuery',
          axios: 'axios',
        },
      },
    },
  },
  plugins: [dts()],
});