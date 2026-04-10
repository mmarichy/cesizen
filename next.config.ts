import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HMR WebSocket : ajoute l’hôte utilisé dans le navigateur (souvent une IP WSL/Docker/LAN).
  allowedDevOrigins: [
    "192.168.82.137",
    "192.168.1.66",
  ],
};

export default nextConfig;
