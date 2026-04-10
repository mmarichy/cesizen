import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Pencil,
  Shield,
  Heart,
} from "lucide-react";
import type { Activity } from "@/lib/activities";
import { ProfilFavoritesGrid } from "@/components/profil/profil-favorites-grid";

const CESI_GREEN = "#00D177";
const CESI_GREEN_SOFT = "#00BC7D";

export type ProfilPageUser = {
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
  role: "USER" | "ADMIN";
};

function getInitials(firstname: string, lastname: string) {
  const f = firstname.trim().charAt(0);
  const l = lastname.trim().charAt(0);
  return `${f}${l}`.toUpperCase();
}

function formatMemberSince(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function ProfilPage({
  user,
  favoriteActivities,
}: {
  user: ProfilPageUser;
  favoriteActivities: Activity[];
}) {
  const fullName = `${user.firstname} ${user.lastname}`.trim();
  const initials = getInitials(user.firstname, user.lastname);
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10">
        <header className="flex flex-col items-center text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${CESI_GREEN_SOFT} 0%, ${CESI_GREEN} 100%)`,
            }}
          >
            <User className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 m-0">
            Mon <span style={{ color: CESI_GREEN }}>Profil</span>
          </h1>
          <p className="text-gray-500 mt-2 text-base sm:text-lg m-0">
            Gérez vos informations personnelles
          </p>
        </header>

        <section
          className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6 sm:p-8 mb-10"
          aria-labelledby="profil-infos-heading"
        >
          <h2 id="profil-infos-heading" className="sr-only">
            Informations du profil
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shrink-0 mx-auto sm:mx-0 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${CESI_GREEN_SOFT} 0%, ${CESI_GREEN} 100%)`,
              }}
              aria-hidden
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 m-0">
                  {fullName}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-gray-600">
                <p className="flex items-center justify-center sm:justify-start gap-2 m-0 text-sm sm:text-base">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: CESI_GREEN }} />
                  <a href={`mailto:${user.email}`} className="text-gray-700 no-underline hover:underline break-all">
                    {user.email}
                  </a>
                </p>
                <p className="flex items-center justify-center sm:justify-start gap-2 m-0 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 shrink-0" style={{ color: CESI_GREEN }} />
                  <span>Membre depuis {formatMemberSince(user.createdAt)}</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4 justify-center sm:justify-start">
                <Link
                  href="/profil/parametre"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[14px] font-semibold text-sm sm:text-base border-2 no-underline transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderColor: CESI_GREEN,
                    color: CESI_GREEN,
                    backgroundColor: "#fff",
                  }}
                >
                  <Pencil className="w-4 h-4" />
                  Modifier le profil
                </Link>
                {isAdmin ? (
                  <Link
                    href="/profil/admin"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[14px] font-semibold text-sm sm:text-base text-white no-underline shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(90deg, #3b82f6 0%, #ec4899 100%)",
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    Accès Back-Office
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="favoris-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md shrink-0">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="min-w-0">
                <h2 id="favoris-heading" className="text-lg sm:text-xl font-bold text-gray-900 m-0">
                  Mes activités favorites
                </h2>
                <p className="text-sm text-gray-500 m-0 mt-0.5">
                  {favoriteActivities.length === 0
                    ? "Aucune activité en favoris"
                    : favoriteActivities.length === 1
                      ? "1 activité enregistrée"
                      : `${favoriteActivities.length} activités enregistrées`}
                </p>
              </div>
            </div>
            {favoriteActivities.length > 0 ? (
              <Link
                href="/activites"
                className="inline-flex items-center justify-center shrink-0 px-5 py-2.5 rounded-[14px] font-semibold text-sm sm:text-base text-white no-underline shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] self-start sm:self-center"
                style={{
                  background: "linear-gradient(90deg, #ef4444 0%, #ec4899 100%)",
                }}
              >
                Parcourir les activités
              </Link>
            ) : null}
          </div>

          {favoriteActivities.length === 0 ? (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 px-6 py-14 flex flex-col items-center text-center">
              <Heart className="w-14 h-14 text-gray-300 mb-4" strokeWidth={1.25} />
              <p className="text-lg font-semibold text-gray-700 m-0">Aucune activité favorite</p>
              <p className="text-gray-500 mt-2 max-w-md m-0">
                Explorez nos activités et ajoutez vos favorites !
              </p>
              <Link
                href="/activites"
                className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-[14px] font-semibold text-white no-underline shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(90deg, #ef4444 0%, #ec4899 100%)",
                }}
              >
                Découvrir les activités
              </Link>
            </div>
          ) : (
            <ProfilFavoritesGrid initialActivities={favoriteActivities} />
          )}
        </section>
      </div>
    </div>
  );
}
