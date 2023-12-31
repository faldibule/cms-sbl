import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
        '@components': '/src/components',
        "@pages": '/src/pages',
        '@variable': '/src/variable',
        '@recoil': '/src/recoil',
        '@hooks': '/src/hooks',
        '@utils': '/src/utils',
      }
    }
});
