
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
    // Configurações agressivas de otimização
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
    cssCodeSplit: true,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        dead_code: true,
        unused: true,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        // Chunking otimizado baseado em grupos funcionais
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react';
          }
          
          // UI components
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'vendor-ui';
          }
          
          // Charts (chunk separado para lazy loading)
          if (id.includes('recharts')) {
            return 'vendor-charts';
          }
          
          // Supabase
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'vendor-data';
          }
          
          // Páginas críticas juntas
          if (id.includes('pages/Dashboard') || id.includes('pages/Activities') || id.includes('pages/Projects')) {
            return 'pages-critical';
          }
          
          // Páginas operacionais
          if (id.includes('pages/DashboardOPs') || id.includes('pages/OrdemProducao') || id.includes('pages/MinhasTarefas')) {
            return 'pages-operational';
          }
          
          // Páginas financeiras
          if (id.includes('pages/Cost') || id.includes('pages/Revenue') || id.includes('pages/Financial')) {
            return 'pages-financial';
          }
          
          // Outras dependências
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // Estratégia de naming otimizada
        chunkFileNames: (chunkInfo) => {
          return `assets/[name]-[hash].js`;
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    
    // Configurações de chunk size mais agressivas
    chunkSizeWarningLimit: 300, // Reduzido para forçar otimização
  },
  
  // Otimizações agressivas de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'date-fns/format',
      'date-fns/parseISO',
    ],
    exclude: [
      'recharts', // Lazy load para performance
    ],
    force: true, // Forçar re-otimização
  },
  
  // CSS optimizations
  css: {
    devSourcemap: false,
    modules: {
      generateScopedName: '[hash:base64:5]', // Nomes mais curtos
    },
  },
  
  // Cache estratégico
  cacheDir: 'node_modules/.vite',
}));
