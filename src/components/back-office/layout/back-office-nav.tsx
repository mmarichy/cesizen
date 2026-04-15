"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, LayoutDashboard, Users } from "lucide-react";

type BackOfficeNavProps = {
  adminRoot: string;
};

const items = [
  {
    key: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    getHref: (adminRoot: string) => `${adminRoot}/dashboard`,
  },
  {
    key: "users",
    label: "Utilisateurs",
    icon: Users,
    getHref: (adminRoot: string) => `${adminRoot}/users`,
  },
  {
    key: "articles",
    label: "Articles",
    icon: FileText,
    getHref: (adminRoot: string) => `${adminRoot}/articles`,
  },
  {
    key: "activites",
    label: "Activités",
    icon: Activity,
    getHref: (adminRoot: string) => `${adminRoot}/activities`,
  },
];

export function BackOfficeNav({ adminRoot }: BackOfficeNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 inline-flex max-w-full rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
      <ul className="flex flex-wrap items-center justify-center gap-1 list-none m-0 p-0">
        {items.map((item) => {
          const href = item.getHref(adminRoot);
          const Icon = item.icon;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={item.key}>
              <Link
                href={href}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold no-underline transition-all",
                  isActive
                    ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-[0_8px_18px_rgba(249,115,22,0.35)]"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
