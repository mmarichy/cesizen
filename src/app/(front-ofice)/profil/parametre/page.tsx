import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ParametreProfilForm } from "./parametre-profil-form";

const CESI_GREEN = "#00D177";

export default async function ParametreProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profil/parametre");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
    },
  });

  if (!user) {
    redirect("/auth/login?callbackUrl=/profil/parametre");
  }

  return (
    <div className="min-h-screen bg-white pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10">
        <header className="mb-10">
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 text-sm font-semibold no-underline hover:underline"
            style={{ color: "#475569" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>

          <div className="mt-8 flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${CESI_GREEN} 0%, #00BC7D 100%)`,
              }}
            >
              <Settings className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-5 mb-2">Paramètres</h1>
            <p className="text-gray-600 m-0 text-base sm:text-lg">Modifiez vos informations personnelles</p>
          </div>
        </header>

        <ParametreProfilForm
          initialFirstname={user.firstname}
          initialLastname={user.lastname}
          email={user.email}
          initialPhone={user.phone ?? ""}
        />
      </div>
    </div>
  );
}
