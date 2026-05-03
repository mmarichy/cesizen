import type { Metadata, Viewport } from "next";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { PwaRegister } from "@/components/providers/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cesizen",
    description:
    "Cesizen — la plateforme pour se ressourcer et s'apaiser ensemble.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cesizen",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="apple-touch-icon"
          href="/img/logo-small-bg-white-192px.png"
        />
      </head>
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
