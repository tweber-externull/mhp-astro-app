import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        "dev.morganhenleypresents.com",
        "morganhenleypresents.com",
      ],
    },
  },
  output: "server",
  integrations: [react()],
  adapter: vercel(),
});
