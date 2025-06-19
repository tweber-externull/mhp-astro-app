import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      allowedHosts: [
        "dev.morganhenleypresents.com",
        "morganhenleypresents.com",
      ],
    },
  },
  output: "server",
  integrations: [react(), tailwind()],
  adapter: node({
    mode: "standalone",
  }),
});
