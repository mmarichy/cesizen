import Link from "next/link";
import { ArrowLeft, CircleAlert } from "lucide-react";
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

export default async function NewActivityPreviewPage({
  searchParams,
}: {
  searchParams?: Promise<{
    title?: string;
    description?: string;
    content?: string;
    tag?: string;
    difficulty?: string;
    duration?: string;
    status?: string;
    author?: string;
  }>;
}) {
  const params = await searchParams;

  const title = params?.title?.trim() || "Titre non renseigné";
  const description = params?.description?.trim() || "Description non renseignée";
  const content = params?.content?.trim() || "_Aucun contenu pour le moment._";
  const tag = params?.tag?.trim() || "relaxation";
  const difficulty = params?.difficulty?.trim() || "EASY";
  const duration = params?.duration?.trim() || "MIN_15";
  const status = params?.status?.trim() || "DRAFT";
  const author = params?.author?.trim() || "Auteur non renseigné";

  const categoryLabel = TAG_LABELS[tag] ?? tag;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/admin/activities/new"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 no-underline transition hover:text-orange-700"
          >
            <ArrowLeft size={16} />
            Retour à la création
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Aperçu avant création
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Prévisualisation de l&apos;activité avec les données du formulaire non enregistrées.
          </p>
        </div>
      </section>

      <div className="inline-flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <CircleAlert size={16} className="mt-0.5 shrink-0" />
        <p>
          Ceci est un aperçu temporaire. Les modifications ne sont pas encore enregistrées.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
              statusBadgeClassName(status),
            ].join(" ")}
          >
            {statusLabel(status)}
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {categoryLabel}
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {difficultyLabel(difficulty)}
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {durationLabel(duration)}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
          {description}
        </p>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Par {author}
        </p>

        <div className="mt-8 border-t border-slate-200 pt-8">
          <ArticleMarkdown source={content} />
        </div>
      </section>
    </div>
  );
}
