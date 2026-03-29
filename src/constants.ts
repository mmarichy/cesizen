import { Heart, Brain, Shield, Zap, Home, BookOpen, Activity, LogIn } from "lucide-react";

export const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/activites", label: "Activités", icon: Activity },
];

export const mobileNavLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/activites", label: "Activités", icon: Activity },
  { href: "/auth/login", label: "Connexion", icon: LogIn },
];

export const homeStats = [
  { value: "15+", label: "Activités", icon: Zap, gradient: "from-emerald-500 to-green-500" },
  { value: "10+", label: "Articles", icon: Brain, gradient: "from-amber-500 to-yellow-500" },
  { value: "100%", label: "Gratuit", icon: Heart, gradient: "from-emerald-500 to-green-500" },
  { value: "RGPD", label: "Conforme", icon: Shield, gradient: "from-amber-500 to-yellow-500" },
];
