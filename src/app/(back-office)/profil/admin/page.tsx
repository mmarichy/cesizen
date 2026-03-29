import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth-options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profil/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/profil");
  }

  return (
    <div className="min-h-[50vh] max-w-lg mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Back-Office</h1>
      <p className="text-gray-600 mt-3">
        Espace réservé aux administrateurs — contenu à définir.
      </p>
      <Link
        href="/profil"
        className="inline-block mt-8 font-semibold text-[#00D177] no-underline hover:underline"
      >
        Retour au profil
      </Link>
    </div>
  );
}
