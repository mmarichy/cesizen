import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconClassName: string;
  iconContainerClassName: string;
};

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  iconContainerClassName,
}: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={iconContainerClassName}>
          <Icon size={18} className={iconClassName} />
        </div>
      </div>
    </article>
  );
}
