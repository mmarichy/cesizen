import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ArticleMarkdown } from "@/components/ui/article-markdown";

export const dynamic = "force-dynamic";

const TAG_LABELS: Record<string, string> = {
  meditation: "Méditation",
  respiration: "Respiration",
  musique: "Musique",
  exercice: "Exercice",
  relaxation: "Relaxation",
};

function statusLabel(status: string) {
  if (status === "PUBLISHED") return "Publié";
  if (status === "ARCHIVED") return "Archivé";
  return "Brouillon";
}

function statusBadgeClassName(status: string) {
  if (status === "PUBLISHED") {
    return "border border-emerald-100 bg-emerald-50 text-emerald-700";
  }
  if (status === "ARCHIVED") {
    return "border border-amber-100 bg-amber-50 text-amber-700";
  }
  return "border border-gray-200 bg-gray-50 text-gray-700";
}

function difficultyLabel(difficulty: string) {
  if (difficulty === "EASY") return "Facile";
  if (difficulty === "MEDIUM") return "Moyen";
  return "Difficile";
}

function durationLabel(duration: string) {
  if (duration === "MIN_15") return "15 minutes";
  if (duration === "MIN_30") return "30 minutes";
  if (duration === "MIN_45") return "45 minutes";
  return "60 minutes";
}

export default async function ActivityPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      tag: true,
      difficulty: true,
      duration: true,
      status: true,
      author: true,
    },
  });

  if (!activity) {
    notFound();
  }

  const categoryLabel = TAG_LABELS[activity.tag] ?? activity.tag;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/admin/activities"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 no-underline transition hover:text-orange-700"
          >
            <ArrowLeft size={16} />
            Retour à la liste
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Aperçu activité
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Prévisualisation du rendu avant publication, telle qu&apos;elle sera lue par les utilisateurs.
          </p>
        </div>

        <Link
          href={`/admin/activities/edit/${activity.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 no-underline transition hover:bg-violet-100 sm:w-auto"
        >
          <Pencil size={16} />
          Modifier l&apos;activité
        </Link>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
              statusBadgeClassName(activity.status),
            ].join(" ")}
          >
            {statusLabel(activity.status)}
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {categoryLabel}
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {difficultyLabel(activity.difficulty)}
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {durationLabel(activity.duration)}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {activity.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
          {activity.description}
        </p>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Par {activity.author}
        </p>

        <div className="mt-8 border-t border-slate-200 pt-8">
          <ArticleMarkdown source={activity.content} />
        </div>
      </section>
    </div>
  );
}
