import { Activity, FileText, PlusCircle, Sparkles, UserPlus, Users } from "lucide-react";
import type { DashboardStats } from "@/lib/admin/dashboard-stats";

export function buildDashboardStatCards({ users, articles, activities }: DashboardStats) {
  return [
    {
      key: "users",
      title: "Utilisateurs totaux",
      value: users.total,
      subtitle: `${users.admins} admins - ${users.newLast7Days} nouveaux (7 jours)`,
      icon: Users,
      iconContainerClassName: "rounded-xl bg-blue-100 p-2",
      iconClassName: "text-blue-600",
    },
    {
      key: "articles",
      title: "Articles",
      value: articles.total,
      subtitle: `${articles.published} publiés`,
      icon: FileText,
      iconContainerClassName: "rounded-xl bg-green-100 p-2",
      iconClassName: "text-green-600",
    },
    {
      key: "activities",
      title: "Activités",
      value: activities.total,
      subtitle: `${activities.published} publiées`,
      icon: Activity,
      iconContainerClassName: "rounded-xl bg-purple-100 p-2",
      iconClassName: "text-purple-600",
    },
  ] as const;
}

export const dashboardQuickActions = [
  {
    key: "create-user",
    title: "Ajouter un utilisateur",
    description: "Créer un nouveau compte",
    icon: UserPlus,
    href: "/admin/users?createUser=1",
    containerClassName: "border-blue-100 bg-blue-50",
    iconClassName: "text-blue-600",
  },
  {
    key: "create-article",
    title: "Créer un article",
    description: "Publier du contenu",
    icon: PlusCircle,
    href: "/admin/articles/new",
    containerClassName: "border-green-100 bg-green-50",
    iconClassName: "text-green-600",
  },
  {
    key: "create-activity",
    title: "Ajouter une activité",
    description: "Nouvelle activité de détente",
    icon: Sparkles,
    href: "/admin/activities",
    containerClassName: "border-purple-100 bg-purple-50",
    iconClassName: "text-purple-600",
  },
] as const;
