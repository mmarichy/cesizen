import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft } from "lucide-react";
import { StatusType } from "@/app/generated/prisma";
import { authOptions } from "@/lib/auth-options";
import {
  ARTICLE_CATEGORY_DEFINITIONS,
  ARTICLE_TITLE_MAX_LENGTH,
} from "@/lib/articles";
import { prisma } from "@/lib/prisma";
import { ArticleContentField } from "@/components/back-office/articles/article-content-field";

export const dynamic = "force-dynamic";

const ALLOWED_ARTICLE_TAGS = new Set(
  ARTICLE_CATEGORY_DEFINITIONS.flatMap((d) => d.tagAliases),
);

const TAG_SELECT_OPTIONS = ARTICLE_CATEGORY_DEFINITIONS.map((def) => ({
  value: def.tagAliases[0],
  label: def.label,
}));

function statusFromForm(raw: string): StatusType | null {
  if (raw === "PUBLISHED") return StatusType.PUBLISHED;
  if (raw === "ARCHIVED") return StatusType.ARCHIVED;
  if (raw === "DRAFT") return StatusType.DRAFT;
  return null;
}

async function updateArticleAction(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return;
  }

  const articleId = String(formData.get("articleId") ?? "").trim();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();
  const status = statusFromForm(statusRaw);

  if (
    !articleId ||
    !title ||
    title.length > ARTICLE_TITLE_MAX_LENGTH ||
    !description ||
    !content ||
    !author ||
    !status
  ) {
    redirect(
      articleId
        ? `/admin/articles/edit/${articleId}?erreur=invalid`
        : "/admin/articles",
    );
  }

  const existing = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, title: true, status: true, tag: true },
  });

  if (!existing) {
    redirect("/admin/articles");
  }

  const tagOk =
    ALLOWED_ARTICLE_TAGS.has(tag) || tag === existing.tag;
  if (!tagOk) {
    redirect(`/admin/articles/edit/${articleId}?erreur=invalid`);
  }

  const prevStatus = existing.status;
  const archivedPatch: { archivedAt?: Date | null } = {};
  if (status !== StatusType.ARCHIVED) {
    archivedPatch.archivedAt = null;
  } else if (prevStatus !== StatusType.ARCHIVED) {
    archivedPatch.archivedAt = new Date();
  }

  await prisma.$transaction(async (tx) => {
    await tx.article.update({
      where: { id: articleId },
      data: {
        title,
        description,
        content,
        tag,
        author,
        status,
        ...archivedPatch,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ARTICLE_UPDATED",
        actorUserId: session.user.id,
        actorEmail: session.user.email ?? "",
        targetUserId: existing.id,
        targetEmail: existing.title,
        metadata: {
          tag,
          status,
          previousStatus: prevStatus,
        },
      },
    });
  });

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

const inputClassName =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100";

const labelClassName = "text-sm font-semibold text-gray-800";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const resolved = await searchParams;
  const showError = resolved?.erreur === "invalid";

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    notFound();
  }

  const tagOptions = [...TAG_SELECT_OPTIONS];
  if (!ALLOWED_ARTICLE_TAGS.has(article.tag)) {
    tagOptions.push({
      value: article.tag,
      label: `${article.tag} (hérité)`,
    });
  }

  const statusDefault =
    article.status === StatusType.PUBLISHED
      ? "PUBLISHED"
      : article.status === StatusType.ARCHIVED
        ? "ARCHIVED"
        : "DRAFT";

  return (
    <div className="space-y-6 sm:space-y-8">
      <section>
        <Link
          href="/admin/articles"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 no-underline transition hover:text-orange-700"
        >
          <ArrowLeft size={16} />
          Retour à la liste
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Modifier l&apos;article
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Mettez à jour les champs ci-dessous. Le corps reste en{" "}
          <strong className="font-semibold text-gray-800">Markdown</strong>.
        </p>
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

        <form action={updateArticleAction} className="space-y-5">
          <input type="hidden" name="articleId" value={id} />

          <div>
            <label htmlFor="article-title" className={labelClassName}>
              Titre{" "}
              <span className="font-normal text-gray-500">
                ({ARTICLE_TITLE_MAX_LENGTH} caractères max.)
              </span>
            </label>
            <input
              id="article-title"
              name="title"
              type="text"
              required
              maxLength={ARTICLE_TITLE_MAX_LENGTH}
              className={inputClassName}
              placeholder="Titre de l'article"
              defaultValue={article.title}
            />
          </div>

          <div>
            <label htmlFor="article-description" className={labelClassName}>
              Description courte
            </label>
            <textarea
              id="article-description"
              name="description"
              required
              rows={3}
              className={`${inputClassName} resize-y min-h-20`}
              placeholder="Résumé affiché dans les listes"
              defaultValue={article.description}
            />
          </div>

          <ArticleContentField
            id="article-content"
            name="content"
            required
            rows={12}
            defaultValue={article.content}
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
              <label htmlFor="article-tag" className={labelClassName}>
                Catégorie
              </label>
              <select
                id="article-tag"
                name="tag"
                required
                className={inputClassName}
                defaultValue={article.tag}
              >
                {tagOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="article-status" className={labelClassName}>
                Statut
              </label>
              <select
                id="article-status"
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
            <label htmlFor="article-author" className={labelClassName}>
              Auteur (nom affiché)
            </label>
            <input
              id="article-author"
              name="author"
              type="text"
              required
              defaultValue={article.author}
              className={inputClassName}
              placeholder="Nom de l'auteur"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/articles"
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
