import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, UserCircle2 } from "lucide-react";

type BackOfficeHeaderProps = {
  adminName: string;
};

export function BackOfficeHeader({ adminName }: BackOfficeHeaderProps) {
  return (
    <header className="relative flex flex-col items-center gap-3 pt-1 sm:min-h-[68px] sm:items-center sm:justify-center sm:pt-0">
      <div className="flex w-full items-center justify-between gap-2 sm:contents">
        <div className="sm:absolute sm:left-6 sm:top-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 no-underline transition-colors hover:bg-white/80 hover:text-slate-900 sm:text-base"
          >
            <ArrowLeft size={18} />
            <span>Accueil</span>
          </Link>
        </div>

        <Image
        src="/img/logo-full-bg-none-1000px.png"
        alt="Logo Cesizen"
        width={120}
        height={76}
        className="h-auto w-[104px] object-contain sm:w-auto"
        priority
      />

        <div className="sm:absolute sm:right-6 sm:top-2">
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white/80"
          >
            <UserCircle2 size={22} className="text-amber-500" />
            <span className="max-w-[110px] truncate sm:max-w-[220px]">{adminName}</span>
          </Link>
        </div>
      </div>
      
    </header>
  );
}
