import { DashboardQuickAction } from "@/components/back-office/dashboard/dashboard-quick-action";
import { DashboardStatCard } from "@/components/back-office/dashboard/dashboard-stat-card";
import {
  buildDashboardStatCards,
  dashboardQuickActions,
} from "@/components/back-office/dashboard/dashboard-data";
import { getDashboardStats } from "@/lib/admin/dashboard-stats";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function statusLabel(status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  if (status === "DRAFT") return "Brouillon";
  if (status === "PUBLISHED") return "Publié";
  return "Archivé";
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const statCards = buildDashboardStatCards(stats);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="mt-2 text-sm text-gray-600">Vue d&apos;ensemble de votre plateforme CESIZen</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <DashboardStatCard
            key={card.key}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            iconContainerClassName={card.iconContainerClassName}
            iconClassName={card.iconClassName}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">Actions rapides</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {dashboardQuickActions.map((action) => (
            <DashboardQuickAction
              key={action.key}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
              containerClassName={action.containerClassName}
              iconClassName={action.iconClassName}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Statuts des articles</h3>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Brouillons</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{stats.articles.draft}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Publiés</p>
              <p className="mt-1 text-2xl font-black text-green-700">{stats.articles.published}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Archivés</p>
              <p className="mt-1 text-2xl font-black text-amber-700">{stats.articles.archived}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Statuts des activités</h3>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Brouillons</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{stats.activities.draft}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Publiées</p>
              <p className="mt-1 text-2xl font-black text-green-700">{stats.activities.published}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Archivées</p>
              <p className="mt-1 text-2xl font-black text-amber-700">{stats.activities.archived}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Derniers inscrits</h3>
          {stats.users.latest.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">Aucun utilisateur inscrit pour le moment.</p>
          ) : (
            <ul className="mt-4 space-y-3 list-none m-0 p-0">
              {stats.users.latest.map((user) => (
                <li key={user.id} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <p className="mt-1 text-xs text-gray-500">Inscrit le {formatDate(user.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Derniers articles</h3>
          {stats.articles.latest.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">Aucun article publié pour le moment.</p>
          ) : (
            <ul className="mt-4 space-y-3 list-none m-0 p-0">
              {stats.articles.latest.map((article) => (
                <li key={article.id} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900">{article.title}</p>
                  <p className="text-xs text-gray-600">Par {article.author}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {statusLabel(article.status)} - {formatDate(article.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Dernières activités</h3>
          {stats.activities.latest.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">Aucune activité publiée pour le moment.</p>
          ) : (
            <ul className="mt-4 space-y-3 list-none m-0 p-0">
              {stats.activities.latest.map((activity) => (
                <li key={activity.id} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600">Par {activity.author}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {statusLabel(activity.status)} - {formatDate(activity.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
