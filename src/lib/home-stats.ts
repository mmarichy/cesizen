import { Brain, Heart, Shield, Zap, type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";

type HomeStat = {
  value: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
};

async function fetchHomeStats() {
  const [publishedActivities, publishedArticles] = await Promise.all([
    prisma.activity.count({ where: { status: "PUBLISHED", archivedAt: null } }),
    prisma.article.count({ where: { status: "PUBLISHED", archivedAt: null } }),
  ]);

  return { publishedActivities, publishedArticles };
}

export async function getHomeStats(): Promise<HomeStat[]> {
  const { publishedActivities, publishedArticles } = await fetchHomeStats();

  return [
    { value: String(publishedActivities), label: "Activités", icon: Zap, gradient: "from-emerald-500 to-green-500" },
    { value: String(publishedArticles), label: "Articles", icon: Brain, gradient: "from-amber-500 to-yellow-500" },
    { value: "100%", label: "Gratuit", icon: Heart, gradient: "from-emerald-500 to-green-500" },
    { value: "RGPD", label: "Conforme", icon: Shield, gradient: "from-amber-500 to-yellow-500" },
  ];
}
