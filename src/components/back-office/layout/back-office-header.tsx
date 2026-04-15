import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, UserCircle2 } from "lucide-react";

type BackOfficeHeaderProps = {
  adminName: string;
};

export function BackOfficeHeader({ adminName }: BackOfficeHeaderProps) {
  return (
    <header className="relative flex min-h-[68px] items-start justify-center">

      <div className="absolute left-4 top-1 sm:left-6 sm:top-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-slate-700 no-underline transition-colors hover:bg-white/80 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>

      <Image
        src="/img/logo-full-bg-none-1000px.png"
        alt="Logo Cesizen"
        width={120}
        height={76}
        className="h-auto w-auto object-contain"
        priority
      />

      <div className="absolute right-4 top-1 sm:right-6 sm:top-2">
        <Link href="/profil" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700">
          <UserCircle2 size={24} className="text-amber-500" />
          <span>{adminName}</span>
        </Link>
      </div>
    </header>
  );
}
