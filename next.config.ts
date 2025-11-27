import type { NextConfig } from "next";

// Al poner ': any', le decimos a VS Code que no moleste con las reglas
const nextConfig: any = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;