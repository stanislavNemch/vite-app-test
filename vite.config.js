import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';

// Ваши плагины
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';
import purgecss from '@fullhuman/postcss-purgecss';
import viteCompression from 'vite-plugin-compression';

// Используем функцию, чтобы получить доступ к переменной `command` ('serve' или 'build')
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  // Автоматически находим все HTML-файлы для многостраничного приложения (MPA)
  const htmlEntries = Object.fromEntries(
    glob
      .sync('src/**/*.html')
      .map(file => [
        resolve(file).split('/').pop().replace('.html', ''),
        resolve(__dirname, file),
      ])
  );

  return {
    root: resolve(__dirname, 'src'),
    base: './',

    // Плагины Vite
    plugins: [
      // Позволяет собирать HTML из частей (partials)
      injectHTML(),

      // Полная перезагрузка страницы при изменении HTML-частей (только для разработки)
      !isBuild && FullReload(['src/partials/**/*.html']),

      // Сжатие ассетов для продакшена (gzip и brotli)
      isBuild &&
        viteCompression({
          verbose: true,
          algorithm: 'brotliCompress',
          ext: '.br',
        }),
      isBuild &&
        viteCompression({
          verbose: true,
          algorithm: 'gzip',
          ext: '.gz',
        }),
    ],

    css: {
      postcss: {
        plugins: [
          // Сортировка media-запросов в CSS (mobile-first по умолчанию)
          SortCss(),

          // Удаление неиспользуемых CSS (только при сборке)
          isBuild &&
            purgecss({
              content: ['./src/**/*.html', './src/js/**/*.js'],
              safelist: {
                standard: ['is-active', 'is-visible'],
                deep: [/swiper/, /modal/],
              },
            }),
        ],
      },
    },

    build: {
      sourcemap: !isBuild, // Включаем sourcemap только для разработки
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: htmlEntries,
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('gsap')) return 'vendor-gsap';
              if (id.includes('swiper')) return 'vendor-swiper';
              return 'vendor-common';
            }
          },
        },
      },
    },
  };
});
