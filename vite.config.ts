
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
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
          
          // Supabase e data
          if (id.includes('@supabase') || id.includes('@tanstack/react-query') || id.includes('zustand')) {
            return 'vendor-data';
          }
          
          // Outras dependências
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'zustand',
    ],
    exclude: [
      'recharts',
    ],
  },
  
  cacheDir: 'node_modules/.vite',
}));
