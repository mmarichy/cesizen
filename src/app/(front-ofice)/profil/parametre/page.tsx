import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  UserCircle2,
  Mail,
  Phone,
  Lock,
  Eye,
  Save,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

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

        <section
          className="rounded-3xl border p-6 sm:p-8 bg-[#fbfffd] shadow-[0_14px_45px_rgba(16,185,129,0.20)]"
          style={{ borderColor: "#c7f8de" }}
          aria-label="Formulaire des paramètres"
        >
          <div className="space-y-8">
            <article>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-sky-500">
                  <UserCircle2 className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Informations personnelles</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Prénom</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <UserCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      defaultValue={user.firstname}
                      className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Nom</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <UserCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      defaultValue={user.lastname}
                      className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Email (non modifiable)</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      value={user.email}
                      disabled
                      className="w-full bg-transparent text-slate-400 outline-none text-sm cursor-not-allowed"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Téléphone</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      defaultValue={user.phone ?? ""}
                      placeholder="06 12 34 56 78"
                      className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
                    />
                  </div>
                </label>
              </div>
            </article>

            <div className="h-px bg-slate-200" />

            <article>
              <div className="flex items-center gap-3 mb-3 pt-10">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-fuchsia-500">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Sécurité</h2>
              </div>

              <p className="text-sm text-slate-600 m-0 mb-4">
                Laissez ces champs vides si vous ne souhaitez pas changer votre mot de passe.
              </p>

              <div className="grid gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Mot de passe actuel</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      placeholder="******"
                      className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
                    />
                    <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Nouveau mot de passe</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      placeholder="******"
                      className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
                    />
                    <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Confirmer le nouveau mot de passe</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      placeholder="******"
                      className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
                    />
                    <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #00D177 0%, #00B875 100%)" }}
                >
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border-2 border-red-500 bg-red-50/40 p-6 sm:p-8 shadow-[0_8px_30px_rgba(239,68,68,0.10)]">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-3xl font-bold text-gray-900 m-0">Zone dangereuse</h2>
              <p className="text-slate-700 mt-2 mb-5">
                La suppression de votre compte est définitive et irréversible. Toutes vos données seront supprimées.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer mon compte
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}