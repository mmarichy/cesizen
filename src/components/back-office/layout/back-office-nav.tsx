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
    label: "Dashboard",
    mobileLabel: "Dashboard",
    icon: LayoutDashboard,
    getHref: (adminRoot: string) => `${adminRoot}/dashboard`,
  },
  {
    key: "users",
    label: "Utilisateurs",
    mobileLabel: "Utilisateurs",
    icon: Users,
    getHref: (adminRoot: string) => `${adminRoot}/users`,
  },
  {
    key: "articles",
    label: "Articles",
    mobileLabel: "Articles",
    icon: FileText,
    getHref: (adminRoot: string) => `${adminRoot}/articles`,
  },
  {
    key: "activites",
    label: "Activités",
    mobileLabel: "Activités",
    icon: Activity,
    getHref: (adminRoot: string) => `${adminRoot}/activities`,
  },
];

export function BackOfficeNav({ adminRoot }: BackOfficeNavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-40 w-full px-5 pb-4 sm:hidden">
        <ul className="m-0 mx-auto flex max-w-3xl items-end justify-between gap-1 rounded-2xl bg-white/70 px-2.5 py-2.5 backdrop-blur-md list-none">
          {items.map((item) => {
            const href = item.getHref(adminRoot);
            const Icon = item.icon;
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={item.key} className="min-w-0 flex-1">
                <Link
                  href={href}
                  aria-label={item.label}
                  className="flex flex-col items-center justify-end gap-1 no-underline"
                >
                  <span
                    className={[
                      "inline-flex h-11 w-11 items-center justify-center rounded-[15px] transition-all",
                      isActive
                        ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-[0_8px_18px_rgba(249,115,22,0.35)]"
                        : "text-slate-500 hover:bg-slate-100 hover:text-orange-500",
                    ].join(" ")}
                  >
                    <Icon size={20} />
                  </span>
                  <span
                    className={[
                      "truncate text-[0.68rem] leading-none",
                      isActive ? "font-bold text-orange-500" : "font-medium text-slate-500",
                    ].join(" ")}
                  >
                    {item.mobileLabel}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav className="mt-6 hidden w-full max-w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm sm:mt-8 sm:inline-flex sm:w-auto">
        <ul className="m-0 flex min-w-max items-center gap-1 p-0 list-none sm:min-w-0 sm:flex-wrap sm:justify-center">
        {items.map((item) => {
          const href = item.getHref(adminRoot);
          const Icon = item.icon;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={item.key}>
              <Link
                href={href}
                className={[
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold no-underline transition-all sm:px-4",
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
    </>
  );
}
