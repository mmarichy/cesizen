import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { ChevronLeft, Clock, User } from "lucide-react";
import { StatusType } from "@/app/generated/prisma";
import { ArticleMarkdown } from "@/components/ui/article-markdown";
import { ActivityFavoriteButton } from "@/components/ui/activity-favorite-button";
import { activityDifficultyChipStyle } from "@/lib/activities";
import { authOptions } from "@/lib/auth-options";
import { mapPrismaActivityToDto } from "@/lib/map-prisma-activity";
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
	const activity = await prisma.activity.findFirst({
		where: {
			id,
			status: StatusType.PUBLISHED,
			archivedAt: null,
		},
		select: { title: true, description: true },
	});

	if (!activity) {
		return {
			title: "Activité | Cesizen",
		};
	}

	return {
		title: `${activity.title} | Cesizen`,
		description: activity.description,
	};
}

export default async function ActivityDetailPage({ params }: PageProps) {
	const { id } = await params;

	const row = await prisma.activity.findFirst({
		where: {
			id,
			status: StatusType.PUBLISHED,
			archivedAt: null,
		},
	});

	if (!row) {
		notFound();
	}

	const dto = mapPrismaActivityToDto(row);
	const dateLabel = toFrenchDate(row.date);
	const difficultyChip =
		activityDifficultyChipStyle[dto.difficulty];

	const session = await getServerSession(authOptions);
	let initialFavorite = false;
	if (session?.user?.id) {
		const fav = await prisma.activityFavorite.findUnique({
			where: {
				userId_activityId: {
					userId: session.user.id,
					activityId: row.id,
				},
			},
			select: { activityId: true },
		});
		initialFavorite = Boolean(fav);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-white via-slate-50/90 to-teal-50/40 pb-28 md:pb-16">
			<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
				<Link
					href="/activites"
					className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-[#0f172a] no-underline transition hover:text-[#020617]">
					<ChevronLeft size={18} aria-hidden />
					Retour aux activités
				</Link>

				<header className="border-b border-slate-200 pb-8">
					<p className="text-sm font-semibold uppercase tracking-wide text-[#64748b]">
						Activité
					</p>
					<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
						<h1 className="min-w-0 flex-1 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
							{row.title}
						</h1>
						<ActivityFavoriteButton
							activityId={row.id}
							initialFavorite={initialFavorite}
						/>
					</div>
					<p className="mt-4 text-lg leading-relaxed text-[#475569]">
						{row.description}
					</p>

					<div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
						<span
							className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold text-white"
							style={{
								backgroundColor: dto.accentColor,
							}}>
							{dto.category}
						</span>
						<span
							className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold"
							style={{
								backgroundColor:
									difficultyChip.backgroundColor,
								color: difficultyChip.color,
							}}>
							{dto.difficulty}
						</span>
						<span className="inline-flex items-center gap-1.5 text-[#334155]">
							<Clock
								size={16}
								className="text-[#64748b]"
								aria-hidden
							/>
							<span className="font-semibold">
								{dto.durationMinutes} minutes
							</span>
						</span>
						<span className="inline-flex items-center gap-1.5 text-[#334155]">
							<User
								size={16}
								className="text-[#64748b]"
								aria-hidden
							/>
							<span className="font-semibold">
								{row.author}
							</span>
						</span>
						<time
							className="text-[#475569]"
							dateTime={row.date
								.toISOString()
								.slice(0, 10)}>
							{dateLabel}
						</time>
					</div>
				</header>

				<div className="pt-8">
					<ArticleMarkdown source={row.content} />
				</div>
			</div>
		</div>
	);
}
