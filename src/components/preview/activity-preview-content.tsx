import { ArticleMarkdown } from "@/components/ui/article-markdown";
import { activityTagToCategory } from "@/lib/activities";

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

type ActivityPreviewContentProps = {
  title: string;
  description: string;
  content: string;
  tag: string;
  difficulty: string;
  duration: string;
  status: string;
  author: string;
};

export function ActivityPreviewContent({
  title,
  description,
  content,
  tag,
  difficulty,
  duration,
  status,
  author,
}: ActivityPreviewContentProps) {
  const categoryLabel = activityTagToCategory(tag).label;

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
