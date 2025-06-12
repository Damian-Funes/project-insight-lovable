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
    // Configurações básicas de otimização
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
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
        // Chunking automático simples
        manualChunks: (id) => {
          // Vendor chunk para node_modules
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // UI components
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // Charts
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Other vendor packages
            return 'vendor';
          }
        },
        
        // Naming strategy para chunks
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
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
