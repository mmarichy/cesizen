import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Tag, User } from "lucide-react";
import { StatusType } from "@/app/generated/prisma";
import { ArticleMarkdown } from "@/components/ui/article-markdown";
import { articleTagToCategory } from "@/lib/articles";
import { prisma } from "@/lib/prisma";

function toFrenchDate(value: Date) {
	return new Intl.DateTimeFormat("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(value);
}

type PageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;
	const article = await prisma.article.findFirst({
		where: {
			id,
			status: StatusType.PUBLISHED,
			archivedAt: null,
		},
		select: { title: true, description: true },
	});

	if (!article) {
		return {
			title: "Article | Cesizen",
		};
	}

	return {
		title: `${article.title} | Cesizen`,
		description: article.description,
	};
}

export default async function ArticleDetailPage({ params }: PageProps) {
	const { id } = await params;

	const article = await prisma.article.findFirst({
		where: {
			id,
			status: StatusType.PUBLISHED,
			archivedAt: null,
		},
	});

	if (!article) {
		notFound();
	}

	const category = articleTagToCategory(article.tag);
	const dateLabel = toFrenchDate(article.date);

	return (
		<div className="min-h-screen bg-linear-to-br from-white via-emerald-50/30 to-yellow-50/30 pb-28 md:pb-16">
			<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
				<Link
					href="/articles"
					className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 no-underline transition hover:text-emerald-950">
					<ChevronLeft size={18} aria-hidden />
					Retour aux articles
				</Link>

				<header className="border-b border-slate-200 pb-8">
					<p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
						Article
					</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
						{article.title}
					</h1>
					<p className="mt-4 text-lg leading-relaxed text-slate-600">
						{article.description}
					</p>

					<div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-700">
						<span
							className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold text-white"
							style={{ backgroundColor: category.color }}>
							<Tag size={14} strokeWidth={2.25} aria-hidden />
							{category.label}
						</span>
						<span className="inline-flex items-center gap-1.5">
							<User size={16} className="text-slate-500" aria-hidden />
							<span className="font-medium text-slate-800">
								{article.author}
							</span>
						</span>
						<time
							className="text-slate-600"
							dateTime={article.date.toISOString().slice(0, 10)}>
							{dateLabel}
						</time>
					</div>
				</header>

				<div className="pt-8">
					<ArticleMarkdown source={article.content} />
				</div>
			</div>
		</div>
	);
}
