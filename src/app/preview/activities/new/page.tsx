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

export default async function NewActivityPreviewEmbedPage({
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <section className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
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
