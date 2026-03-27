import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cesizen",
  description: "Cesizen se ressourcer et s'apaiser ensemble",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        {children}
        {/* Espaceur pour la barre de navigation mobile fixe en bas */}
        <div className="h-24 md:hidden" aria-hidden="true" />
        <Footer />
      </body>
    </html>
  );
}
