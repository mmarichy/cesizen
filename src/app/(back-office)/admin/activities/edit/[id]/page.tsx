import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft } from "lucide-react";
import {
  ActivityDuration,
  DifficultyLevel,
  StatusType,
} from "@/app/generated/prisma";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ActivityDescriptionField } from "@/components/back-office/activities/activity-description-field";
import { ActivityTitleField } from "@/components/back-office/activities/activity-title-field";
import { ArticleContentField } from "@/components/back-office/articles/article-content-field";
import { UnsavedFormGuard } from "@/components/back-office/unsaved-form-guard";

export const dynamic = "force-dynamic";

const TAG_SELECT_OPTIONS: { value: string; label: string }[] = [
  { value: "meditation", label: "Méditation" },
  { value: "respiration", label: "Respiration" },
  { value: "musique", label: "Musique" },
  { value: "exercice", label: "Exercice" },
  { value: "relaxation", label: "Relaxation" },
];

const ALLOWED_ACTIVITY_TAGS = new Set(TAG_SELECT_OPTIONS.map((opt) => opt.value));

const DIFFICULTY_SELECT_OPTIONS = [
  { value: DifficultyLevel.EASY, label: "Facile" },
  { value: DifficultyLevel.MEDIUM, label: "Moyen" },
  { value: DifficultyLevel.HARD, label: "Difficile" },
] as const;

const DURATION_SELECT_OPTIONS = [
  { value: ActivityDuration.MIN_15, label: "15 minutes" },
  { value: ActivityDuration.MIN_30, label: "30 minutes" },
  { value: ActivityDuration.MIN_45, label: "45 minutes" },
  { value: ActivityDuration.HOUR_1, label: "60 minutes" },
] as const;
const ACTIVITY_TITLE_MAX_LENGTH = 120;
const ACTIVITY_DESCRIPTION_MAX_LENGTH = 280;

function statusFromForm(raw: string): StatusType | null {
  if (raw === "PUBLISHED") {
    return StatusType.PUBLISHED;
  }

  if (raw === "ARCHIVED") {
    return StatusType.ARCHIVED;
  }

  if (raw === "DRAFT") {
    return StatusType.DRAFT;
  }

  return null;
}

function difficultyFromForm(raw: string): DifficultyLevel | null {
  if (raw === DifficultyLevel.EASY) {
    return DifficultyLevel.EASY;
  }

  if (raw === DifficultyLevel.MEDIUM) {
    return DifficultyLevel.MEDIUM;
  }

  if (raw === DifficultyLevel.HARD) {
    return DifficultyLevel.HARD;
  }

  return null;
}

function durationFromForm(raw: string): ActivityDuration | null {
  if (raw === ActivityDuration.MIN_15) {
    return ActivityDuration.MIN_15;
  }

  if (raw === ActivityDuration.MIN_30) {
    return ActivityDuration.MIN_30;
  }

  if (raw === ActivityDuration.MIN_45) {
    return ActivityDuration.MIN_45;
  }

  if (raw === ActivityDuration.HOUR_1) {
    return ActivityDuration.HOUR_1;
  }

  return null;
}

async function updateActivityAction(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return;
  }

  const activityId = String(formData.get("activityId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();

  const difficultyRaw = String(formData.get("difficulty") ?? "").trim();
  const durationRaw = String(formData.get("duration") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();

  const difficulty = difficultyFromForm(difficultyRaw);
  const duration = durationFromForm(durationRaw);
  const status = statusFromForm(statusRaw);

  if (
    !activityId
    || !title
    || title.length > ACTIVITY_TITLE_MAX_LENGTH
    || !description
    || description.length > ACTIVITY_DESCRIPTION_MAX_LENGTH
    || !content
    || !author
    || !difficulty
    || !duration
    || !status
  ) {
    redirect(
      activityId
        ? `/admin/activities/edit/${activityId}?erreur=invalid`
        : "/admin/activities",
    );
  }

  const existing = await prisma.activity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      title: true,
      description: true,
      tag: true,
      status: true,
    },
  });

  if (!existing) {
    redirect("/admin/activities");
  }

  const tagOk = ALLOWED_ACTIVITY_TAGS.has(tag) || tag === existing.tag;
  if (!tagOk) {
    redirect(`/admin/activities/edit/${activityId}?erreur=invalid`);
  }

  const archivedPatch: { archivedAt?: Date | null } = {};
  if (status !== StatusType.ARCHIVED) {
    archivedPatch.archivedAt = null;
  } else if (existing.status !== StatusType.ARCHIVED) {
    archivedPatch.archivedAt = new Date();
  }

  await prisma.$transaction(async (tx) => {
    await tx.activity.update({
      where: { id: activityId },
      data: {
        title,
        description,
        content,
        tag,
        difficulty,
        duration,
        status,
        author,
        ...archivedPatch,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ACTIVITY_UPDATED",
        actorUserId: session.user.id,
        actorEmail: session.user.email ?? "",
        targetUserId: existing.id,
        targetEmail: title,
        metadata: {
          titleFrom: existing.title,
          titleTo: title,
          descriptionFrom: existing.description,
          descriptionTo: description,
          tag,
          status,
          previousStatus: existing.status,
          difficulty,
          duration,
        },
      },
    });
  });

  revalidatePath("/admin/activities");
  redirect("/admin/activities");
}

const inputClassName =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100";

const labelClassName = "text-sm font-semibold text-gray-800";

export default async function EditActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const resolved = await searchParams;
  const showError = resolved?.erreur === "invalid";

  const activity = await prisma.activity.findUnique({
    where: { id },
  });

  if (!activity) {
    notFound();
  }

  const tagOptions = [...TAG_SELECT_OPTIONS];
  if (!ALLOWED_ACTIVITY_TAGS.has(activity.tag)) {
    tagOptions.push({
      value: activity.tag,
      label: `${activity.tag} (hérité)`,
    });
  }

  const statusDefault =
    activity.status === StatusType.PUBLISHED
      ? "PUBLISHED"
      : activity.status === StatusType.ARCHIVED
        ? "ARCHIVED"
        : "DRAFT";

  return (
    <div className="space-y-6 sm:space-y-8">
      <section>
        <Link
          href="/admin/activities"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 no-underline transition hover:text-orange-700"
        >
          <ArrowLeft size={16} />
          Retour à la liste
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Modifier l&apos;activité
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Mettez à jour les champs ci-dessous. Le contenu reste en{" "}
          <strong className="font-semibold text-gray-800">Markdown</strong>.
        </p>
        <Link
          href={`/admin/activities/preview/${id}`}
          className="mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-100"
        >
          Voir l&apos;aperçu
        </Link>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        {showError ? (
          <p
            className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            Veuillez vérifier que tous les champs obligatoires sont correctement
            remplis.
          </p>
        ) : null}

        <UnsavedFormGuard formId="edit-activity-form" />
        <form id="edit-activity-form" action={updateActivityAction} className="space-y-5">
          <input type="hidden" name="activityId" value={id} />

          <ActivityTitleField
            id="activity-title"
            name="title"
            maxLength={ACTIVITY_TITLE_MAX_LENGTH}
            defaultValue={activity.title}
            labelClassName={labelClassName}
            inputClassName={inputClassName}
          />

          <ActivityDescriptionField
            id="activity-description"
            name="description"
            maxLength={ACTIVITY_DESCRIPTION_MAX_LENGTH}
            defaultValue={activity.description}
            labelClassName={labelClassName}
            inputClassName={inputClassName}
          />

          <ArticleContentField
            id="activity-content"
            name="content"
            required
            rows={12}
            defaultValue={activity.content}
            labelClassName={labelClassName}
            toolbarTextClassName="text-xs text-gray-600 sm:text-sm"
            className={`${inputClassName} resize-y min-h-48 font-mono text-sm sm:text-base`}
            placeholder={
              "# Titre\n\nTexte avec **gras** et *italique*.\n\n- élément de liste\n- autre point"
            }
          >
            <details className="mt-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:text-sm">
              <summary className="cursor-pointer font-semibold text-gray-800">
                Rappel syntaxe Markdown
              </summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[0.7rem] leading-relaxed text-gray-700 sm:text-xs">
                {`## Sous-titre

Paragraphe. **Gras** et *italique*.
Tailles : boutons Petit / Corps / Grand (ou <small> et <span class="article-size-lg">).

- Liste à puces
1. Liste numérotée

[Lien](https://exemple.fr)

> Citation

\`\`\`
Bloc de code
\`\`\``}
              </pre>
            </details>
          </ArticleContentField>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="activity-tag" className={labelClassName}>
                Catégorie
              </label>
              <select
                id="activity-tag"
                name="tag"
                required
                className={inputClassName}
                defaultValue={activity.tag}
              >
                {tagOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="activity-difficulty" className={labelClassName}>
                Difficulté
              </label>
              <select
                id="activity-difficulty"
                name="difficulty"
                required
                className={inputClassName}
                defaultValue={activity.difficulty}
              >
                {DIFFICULTY_SELECT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="activity-duration" className={labelClassName}>
                Durée
              </label>
              <select
                id="activity-duration"
                name="duration"
                required
                className={inputClassName}
                defaultValue={activity.duration}
              >
                {DURATION_SELECT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="activity-status" className={labelClassName}>
                Statut
              </label>
              <select
                id="activity-status"
                name="status"
                required
                className={inputClassName}
                defaultValue={statusDefault}
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="activity-author" className={labelClassName}>
              Auteur (nom affiché)
            </label>
            <input
              id="activity-author"
              name="author"
              type="text"
              required
              defaultValue={activity.author}
              className={inputClassName}
              placeholder="Nom de l'auteur"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/activities"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 no-underline transition hover:bg-gray-50 sm:min-w-32"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.3)] transition hover:brightness-105 sm:min-w-40"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
