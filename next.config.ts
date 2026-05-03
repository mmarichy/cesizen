import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HMR WebSocket : ajoute l’hôte utilisé dans le navigateur (souvent une IP WSL/Docker/LAN).
  allowedDevOrigins: [
    "192.168.1.157",
  ],
};

export default nextConfig;
