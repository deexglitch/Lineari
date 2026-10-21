import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    //lets you write '@/components/...' instead of long relative paths
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  //read the .env in the root, only variables starting with VITE_ reach the browser
  envDir: '..'
})
