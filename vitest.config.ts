import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
  },
  // Needed for import.meta.env.BASE_URL used in formatters
  define: {
    "import.meta.env.BASE_URL": JSON.stringify("/Web-Portfolio-AIR-Terminal/"),
  },
});
