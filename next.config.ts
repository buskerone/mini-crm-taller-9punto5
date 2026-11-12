import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` no debe agregar su propio bloque a AGENTS.md: ahí van las reglas del taller.
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
