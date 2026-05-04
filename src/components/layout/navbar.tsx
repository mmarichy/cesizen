"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { User, LogIn, DoorOpen, Home, BookOpen, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/activites", label: "Activités", icon: Activity },
];
const mobileNavLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/activites", label: "Activités", icon: Activity },
  { href: "/auth/login", label: "Connexion", icon: LogIn },
];

const mobileMainLinks = mobileNavLinks.filter((l) => l.href !== "/auth/login");

const authOrangeSx = {
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
} as const;

/** Bouton rond icône seule — connexion mobile (barre du haut) */
const mobileAuthTopSx = {
  ...authOrangeSx,
  px: 0,
  py: 0,
  gap: 0,
  minWidth: 40,
  width: 40,
  height: 40,
} as const;

/** Déconnexion : rouge + icône DoorOpen (desktop : avec texte, mobile : icône seule) */
const desktopSignOutSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 2,
  py: 1,
  borderRadius: "15px",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#fff",
  background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
  textTransform: "none",
  whiteSpace: "nowrap",
  transform: "scale(1)",
  transition: "background .2s, color .2s, transform .2s",
  minWidth: "unset",
  "&:hover": {
    background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    transform: "scale(1.05)",
  },
  "&:active": { transform: "scale(0.97)" },
} as const;

/** Déconnexion mobile : même style rouge, format carré 40px */
const mobileSignOutTopSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 0,
  py: 0,
  gap: 0,
  minWidth: 40,
  width: 40,
  height: 40,
  borderRadius: "15px",
  fontWeight: 500,
  color: "#fff",
  background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
  textTransform: "none",
  transform: "scale(1)",
  transition: "background .2s, transform .2s",
  "&:hover": {
    background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    transform: "scale(1.05)",
  },
  "&:active": { transform: "scale(0.97)" },
} as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const authenticated = status === "authenticated";

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <nav className=" bg-white/70 backdrop-blur-md sticky top-0 z-60 shadow-sm">
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 h-16 w-full">
          {/* Mobile : bouton auth en overlay à droite pour garder le logo centré */}
          <div className="absolute inset-y-0 right-4 z-10 flex items-center md:hidden">
            {status === "loading" ? (
              <div className="h-10 w-10 rounded-[15px] bg-gray-100 animate-pulse" aria-hidden />
            ) : authenticated ? (
              <Button
                variant="text"
                size="small"
                onClick={() => void handleSignOut()}
                sx={{ ...mobileSignOutTopSx }}
                aria-label="Déconnexion"
              >
                <DoorOpen size={20} aria-hidden strokeWidth={2.25} />
              </Button>
            ) : (
              <Button
                variant="text"
                size="small"
                onClick={() => (window.location.href = "/auth/login")}
                sx={{ ...mobileAuthTopSx }}
                aria-label="Connexion"
              >
                <LogIn size={20} aria-hidden />
              </Button>
            )}
          </div>

          <div className="flex h-full items-center justify-center md:justify-between gap-3 md:gap-8 w-full">
          <Link href="/" className="flex items-center gap-3 shrink-0 no-underline">
            <Image
              src="/img/logo-full-bg-none-1000px.png"
              alt="logo Cesizen"
              width={100}
              height={64}
              className="object-contain w-auto h-auto "
              priority
            />
          </Link>
          <div className="lg:flex flex-col ml-2 hidden">
            <span className="text-xs text-gray-500">
              Votre bien-être<br />à portée de main
            </span>
          </div>

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
                      background: isActive
                        ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)"
                        : "transparent",
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

          <div className="hidden md:flex items-center gap-2 shrink-0">
            {status === "loading" ? (
              <div
                className="h-9 w-30 rounded-[15px] bg-gray-100 animate-pulse"
                aria-hidden
              />
            ) : authenticated ? (
              <>
                <Button
                  component={Link}
                  href="/profil"
                  variant="text"
                  size="small"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: "15px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#00A66B",
                    border: "2px solid #00BC7D",
                    background: "#fff",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    transform: "scale(1)",
                    transition: "background .2s, color .2s, transform .2s",
                    minWidth: "unset",
                    "&:hover": {
                      background: "#ecfdf5",
                      transform: "scale(1.05)",
                    },
                    "&:active": { transform: "scale(0.97)" },
                  }}
                >
                  <User size={18} />
                  <span>Profil</span>
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => void handleSignOut()}
                  sx={{ ...desktopSignOutSx }}
                >
                  <DoorOpen size={18} aria-hidden strokeWidth={2.25} />
                  <span>Déconnexion</span>
                </Button>
              </>
            ) : (
              <Button
                variant="text"
                size="small"
                onClick={() => (window.location.href = "/auth/login")}
                sx={{ ...authOrangeSx }}
              >
                Connexion
              </Button>
            )}
          </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 px-6 pb-4">
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white/70 backdrop-blur-md px-2.5 py-2.5 shadow-sm">
          <div className="flex items-end justify-between gap-1 sm:gap-2">
            {mobileMainLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-end flex-1 min-w-0 no-underline"
                  style={{ gap: 4 }}
                >
                  <Button
                    variant={isActive ? "contained" : "text"}
                    disableElevation
                    onClick={() => (window.location.href = href)}
                    sx={{
                      textTransform: "none",
                      minWidth: "unset",
                      width: 42,
                      height: 42,
                      borderRadius: "15px",
                      p: 0,
                      color: isActive ? "#fff" : "#64748b",
                      background: isActive
                        ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)"
                        : "transparent",
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
            {authenticated ? (
              <Link
                href="/profil"
                className="flex flex-col items-center justify-end flex-1 min-w-0 no-underline"
                style={{ gap: 4 }}
              >
                <Button
                  variant={pathname.startsWith("/profil") ? "contained" : "text"}
                  disableElevation
                  sx={{
                    textTransform: "none",
                    minWidth: "unset",
                    width: 42,
                    height: 42,
                    borderRadius: "15px",
                    p: 0,
                    color: pathname.startsWith("/profil") ? "#fff" : "#64748b",
                    background: pathname.startsWith("/profil")
                      ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)"
                      : "transparent",
                    "&:hover": {
                      background: pathname.startsWith("/profil")
                        ? "linear-gradient(135deg, #00BC7D 0%, #00C950 100%)"
                        : "#f1f5f9",
                      color: pathname.startsWith("/profil") ? "#fff" : "#00A66B",
                    },
                  }}
                >
                  <User size={20} />
                </Button>
                <span
                  style={{
                    fontSize: "0.68rem",
                    lineHeight: 1,
                    fontWeight: pathname.startsWith("/profil") ? 700 : 500,
                    color: pathname.startsWith("/profil") ? "#00A66B" : "#64748b",
                  }}
                >
                  Profil
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
