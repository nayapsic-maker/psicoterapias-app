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
          // Los datos rara vez cambian junto con el código: cada conjunto va en su archivo y se cachea por separado.
          const datos = id.match(/src\/datos\/(escuelas|glosario|enlaces|transversales|autoresTeoricos|citasAmpliadas|planes|filosofia|fundamentos|subperspectivas)\.js/)
          if (datos) return 'datos-' + datos[1]
        },
      },
    },
  },
})
