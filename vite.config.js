import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/fitness_app/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: false, passes: 2 },
      mangle: true,
    },
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'assets/app.[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (info) => {
          if (/\.(png|jpg|svg|ico)$/.test(info.name)) return 'icons/[name][extname]';
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
