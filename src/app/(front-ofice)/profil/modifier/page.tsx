import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth-options";

export default async function ModifierProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profil/modifier");
  }

  return (
    <div className="min-h-[50vh] max-w-lg mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Modifier le profil</h1>
      <p className="text-gray-600 mt-3">
        Cette section sera disponible prochainement.
      </p>
      <Link
        href="/profil"
        className="inline-flex items-center gap-2 mt-8 text-[#00D177] font-semibold no-underline hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au profil
      </Link>
    </div>
  );
}
