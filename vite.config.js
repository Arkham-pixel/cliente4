import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  // …
  define: {
    // le dice a Vite que reemplace todas las referencias a `global` por `window`
    global: "window"
  }
});
=======
  server: {
    proxy: {
      '/api': {
        target: 'http://13.59.106.174:3000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://13.59.106.174:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: { global: 'window' }
})
>>>>>>> 6df747633d2fa06c0f582752e6d4703edf89e2c1
