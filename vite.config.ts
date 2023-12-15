import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  esbuild: {
    pure: mode === "production" ? ["console.log"] : [],
  },
}));
