
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Visualizador de bundle para análise
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // Compressão Brotli
    mode === 'production' && compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      compressionOptions: { level: 11 },
      threshold: 1024,
    }),
    // Compressão Gzip como fallback
    mode === 'production' && compression({
      algorithm: 'gzip',
      ext: '.gz',
      compressionOptions: { level: 9 },
      threshold: 1024,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Configurações de otimização
    target: 'es2020',
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        // Estratégia de chunking otimizada
        manualChunks: {
          // Vendor principal - React e dependências core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Library - Radix UI e Tailwind
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-button',
            '@radix-ui/react-card',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          
          // Charts Library - Recharts
          'charts-vendor': ['recharts'],
          
          // Data Management - TanStack Query e date-fns
          'data-vendor': ['@tanstack/react-query', 'date-fns'],
          
          // Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Icons
          'icons-vendor': ['lucide-react'],
          
          // Form handling
          'forms-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Utils
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
        
        // Naming strategy para chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.\w+$/, '')
            : 'chunk';
          
          return `assets/[name]-[hash].js`;
        },
        
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          
          if (ext === 'css') {
            return `assets/css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        },
      },
      
      // Tree shaking agressivo
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    
    // Configurações de chunk size
    chunkSizeWarningLimit: 500,
  },
  
  // Otimizações de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'date-fns',
      'recharts',
    ],
    exclude: [
      // Excluir dependências que devem ser carregadas sob demanda
    ],
  },
  
  // CSS optimizations
  css: {
    devSourcemap: false,
  },
}));
