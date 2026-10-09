import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Las bibliotecas rara vez cambian: en un archivo aparte se descargan en paralelo y se cachean.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
          if (id.includes('node_modules/lucide-react')) return 'iconos'
        },
      },
    },
  },
})
