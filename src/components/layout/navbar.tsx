"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { navLinks, mobileNavLinks } from "@/constants";

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Barre de navigation desktop ── */}
      <nav className=" bg-white/70 backdrop-blur-md sticky top-0 z-60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-center md:justify-between gap-4 md:gap-8">

          {/* Logo */}
          <Link href="/" className="mx-auto md:mx-0 flex items-center gap-3 shrink-0 no-underline">
            <Image
              src="/img/logo-full-bg-none-1000px.png"
              alt="logo Cesizen"
              width={100}
              height={64}
              className="object-contain w-auto h-auto "
              priority
            />
          </Link>
          {/* Texte sous le logo */}
          <div className="lg:flex flex-col ml-2 hidden">
            <span className="text-xs text-gray-500">
              Votre bien-être<br />à portée de main
            </span>
          </div>

          {/* Liens de navigation — masqués sur mobile */}
          <ul className="hidden md:flex items-center gap-5 list-none m-0 p-0 flex-1 justify-center">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Button
                    component={Link}
                    href={href}
                    variant="text"
                    color="inherit"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: "15px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: isActive ? "#fff" : "#374151",
                      background: isActive ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)" : "transparent",
                      boxShadow: isActive ? "0 2px 8px 0 #16a34a33" : "none",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      transform: "scale(1)",
                      transition: "background .2s, color .2s, transform .2s",
                      "&:hover": {
                        background: isActive
                          ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)"
                          : "#f3f4f6",
                        color: isActive ? "#fff" : "#16a34a",
                        transform: "scale(1.05)",
                      },
                      "&:active": { transform: "scale(0.97)" },
                      minWidth: "unset",
                    }}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Button>
                </li>
              );
            })}
          </ul>

          {/* Bouton Connexion — masqué sur mobile */}
          <div className="hidden md:block">
            <Button
              variant="text"
              size="small"
              onClick={() => window.location.href = "/auth/login"}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: "15px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#fff",
                background: "linear-gradient(135deg, #FDC700 0%, #FF8904 100%)",
                textTransform: "none",
                whiteSpace: "nowrap",
                transform: "scale(1)",
                transition: "background .2s, color .2s, transform .2s",
                minWidth: "unset",
                "&:hover": {
                  background: "linear-gradient(135deg, #FDC700 0%, #FF8904 100%)",
                  transform: "scale(1.05)",
                },
                "&:active": { transform: "scale(0.97)" },
              }}
            >
              Connexion
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Barre de navigation mobile flottante (bottom) ── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 px-6 pb-4">
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white/70 backdrop-blur-md px-2.5 py-2.5 shadow-sm">
          <div className="flex items-end justify-between gap-2">
            {mobileNavLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-end flex-1 no-underline"
                  style={{ gap: 4 }}
                >
                  <Button
                    variant={isActive ? "contained" : "text"}
                    disableElevation
                    onClick={() => window.location.href = href}
                    sx={{
                      textTransform: "none",
                      minWidth: "unset",
                      width: 42,
                      height: 42,
                      borderRadius: "15px",
                      p: 0,
                      color: isActive ? "#fff" : "#64748b",
                      background: isActive ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)" : "transparent",
                      "&:hover": {
                        background: isActive
                          ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)"
                          : "#f1f5f9",
                        color: isActive ? "#fff" : "#00A66B",
                      },
                    }}
                  >
                    <Icon size={20} />
                  </Button>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      lineHeight: 1,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#00A66B" : "#64748b",
                    }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
