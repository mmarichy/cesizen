import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
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

async function createArticleAction(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();

  if (
    !title ||
    title.length > ARTICLE_TITLE_MAX_LENGTH ||
    !description ||
    !content ||
    !author ||
    !ALLOWED_ARTICLE_TAGS.has(tag) ||
    (statusRaw !== "DRAFT" && statusRaw !== "PUBLISHED")
  ) {
    redirect("/admin/articles/new?erreur=invalid");
  }

  const status =
    statusRaw === "PUBLISHED" ? StatusType.PUBLISHED : StatusType.DRAFT;

  await prisma.$transaction(async (tx) => {
    const created = await tx.article.create({
      data: {
        title,
        description,
        content,
        tag,
        author,
        status,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ARTICLE_CREATED",
        actorUserId: session.user.id,
        actorEmail: session.user.email ?? "",
        targetUserId: created.id,
        targetEmail: created.title,
        metadata: {
          tag: created.tag,
          status: created.status,
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

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams?: Promise<{ erreur?: string }>;
}) {
  const resolved = await searchParams;
  const showError = resolved?.erreur === "invalid";

  const session = await getServerSession(authOptions);
  const defaultAuthor =
    session?.user?.name?.trim() ||
    session?.user?.email?.trim() ||
    "";

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
          Nouvel article
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Renseignez les champs ci-dessous. Le corps de l’article accepte le{" "}
          <strong className="font-semibold text-gray-800">Markdown</strong>{" "}
          (titres, listes, liens, emphase) et sera affiché formaté sur le site.
          La date de publication est celle du jour à la création.
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

        <form action={createArticleAction} className="space-y-5">
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
            />
          </div>

          <ArticleContentField
            id="article-content"
            name="content"
            required
            rows={12}
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
                defaultValue={TAG_SELECT_OPTIONS[0]?.value}
              >
                {TAG_SELECT_OPTIONS.map((opt) => (
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
                defaultValue="DRAFT"
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
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
              defaultValue={defaultAuthor}
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
              Créer l&apos;article
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
