import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil", dotColor: "#FDC700", hoverColor: "#FDC700" },
  { href: "/articles", label: "Articles", dotColor: "#00BC7D", hoverColor: "#00C950" },
  { href: "/activites", label: "Activités de détente", dotColor: "#FDC700", hoverColor: "#FDC700" },
  { href: "/profil", label: "Mon profil", dotColor: "#00BC7D", hoverColor: "#00C950" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales", dotColor: "#00BC7D", hoverColor: "#00C950" },
  { href: "/confidentialite", label: "Politique de confidentialité", dotColor: "#FDC700", hoverColor: "#FDC700" },
  { href: "/cgu", label: "CGU", dotColor: "#00BC7D", hoverColor: "#00C950" },
];

export function Footer() {
  return (
    <footer
      className="text-gray-300"
      style={{ background: "linear-gradient(to right, #1e293b 0%, #0f1b2d 50%, #1e293b 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-10">

          {/* Brand — colonne gauche */}
          <div className="flex flex-col gap-4 max-w-xs shrink-0">
            <div className="flex items-center gap-3">
              <Image
                src="/img/logo-full-bg-none-1000px.png"
                alt="logo Cesizen"
                width={100}
                height={100}
                className="rounded-lg object-contain w-auto h-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plateforme de santé mentale et gestion du stress du Ministère de la Santé et de la Prévention.
            </p>
            <p className="text-sm text-gray-500 italic">Votre bien-être est notre priorité.</p>
          </div>

          {/* <div className="flex  gap-10 md:ml-auto"> */}
          <div className="flex flex-col flex-wrap md:flex-row gap-10 md:ml-auto">
            {/* Navigation */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-semibold text-base">Navigation</h3>
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {navLinks.map(({ href, label, dotColor, hoverColor }) => (
                  <li key={href} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                    <Link
                      href={href}
                      style={{ "--hover-color": hoverColor } as CSSProperties}
                      className="text-sm text-gray-400 transition-colors no-underline hover:text-(--hover-color) duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Informations légales */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-semibold text-base">Informations légales</h3>
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {legalLinks.map(({ href, label, dotColor, hoverColor }) => (
                  <li key={href} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                    <Link
                      href={href}
                      className="text-sm text-gray-400 transition-colors no-underline hover:text-(--hover-color) duration-300"
                      style={{ "--hover-color": hoverColor } as CSSProperties}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 text-xs text-gray-500 text-center">
          <p>
            © 2026 CESIZen - Ministère de la Santé et de la Prévention.<br className="md:hidden" /> Tous droits réservés.
          </p>
          <p className="flex items-center gap-1 border-t border-white/10 pt-2 md:border-none md:pt-0">
            Développé avec <Heart size={12} className="text-red-500 fill-red-500" /> pour votre bien-être
          </p>
        </div>
      </div>
    </footer>
  );
}
