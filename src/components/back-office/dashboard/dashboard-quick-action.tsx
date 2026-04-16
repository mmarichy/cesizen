import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type DashboardQuickActionProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  containerClassName: string;
  href?: string;
};

export function DashboardQuickAction({
  title,
  description,
  icon: Icon,
  iconClassName,
  containerClassName,
  href,
}: DashboardQuickActionProps) {
  const content = (
    <>
      <Icon size={18} className={`mt-0.5 ${iconClassName}`} />
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-gray-600">{description}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex items-start gap-3 rounded-xl border p-4 text-left text-gray-800 no-underline transition-transform hover:scale-[1.01] ${containerClassName}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className={`flex items-start gap-3 rounded-xl border p-4 text-left text-gray-800 cursor-not-allowed ${containerClassName}`}
    >
      {content}
    </button>
  );
}
