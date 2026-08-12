import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-htaccess",
      closeBundle() {
        copyFileSync(resolve(__dirname, "public/.htaccess"), resolve(__dirname, "dist/.htaccess"));
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
