
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import process from node:process to resolve "Property 'cwd' does not exist on type 'Process'" and ensure Node types are used
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // 加载环境变量（包括 Vercel 设置的变量）
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './', 
    // Fix: Removed define block for process.env.API_KEY as it is injected automatically per GenAI SDK guidelines
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
        },
      },
    },
    server: {
      port: 3000,
      host: true
    }
  };
});
