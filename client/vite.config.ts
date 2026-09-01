import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "lucide-react",
      "recharts",
      "@tanstack/react-query",
      "@tanstack/react-router",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "sonner",
      "date-fns",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5099",
        changeOrigin: true,
        secure: false,
      },
    },
    warmup: {
      clientFiles: [
        "./src/routes/__root.tsx",
        "./src/routes/index.tsx",
        "./src/components/erp/ErpLayout.tsx",
        "./src/components/erp/AppSidebar.tsx",
        "./src/components/erp/TopBar.tsx",
      ],
    },
  },
});
