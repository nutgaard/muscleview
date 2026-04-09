import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE_PATH ?? "/",
  build: {
    target: "esnext",
  },
  fmt: {},
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [react(), svgr()],
});
