import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  base: "/Web-Portfolio-AIR-Terminal/",
  plugins: [preact()],
  server: { host: true, port: 3000 },
});
