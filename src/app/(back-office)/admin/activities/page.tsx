"use client";

import Link from "next/link";
import {
	useEffect,
	useState,
} from "react";
import { toast, Toaster } from "sonner";
import {
	Clock3,
	Eye,
	Pencil,
	Plus,
	Power,
} from "lucide-react";
import { AdminSearchInput } from "@/components/back-office/admin-search-input";
import { DeleteActivityButton } from "@/components/back-office/activities/delete-activity-button";
import { useAdminActivities } from "@/components/back-office/activities/use-admin-activities";
import { toggleButtonClassName } from "@/components/back-office/users/users-shared";
import { PaginationControls } from "@/components/ui/pagination-controls";

function statusLabel(status: string) {
	if (status === "PUBLISHED") {
		return "Publié";
	}

	if (status === "ARCHIVED") {
		return "Archivé";
	}

	return "Brouillon";
}

function statusBadgeClassName(
	status: string,
) {
	if (status === "PUBLISHED") {
		return "border border-emerald-100 bg-emerald-50 text-emerald-700";
	}

	if (status === "ARCHIVED") {
		return "border border-amber-100 bg-amber-50 text-amber-700";
	}

	return "border border-gray-200 bg-gray-50 text-gray-700";
}

function getMessage(
	data: unknown,
	fallback: string,
) {
	if (
		typeof data === "object" &&
		data !== null &&
		"message" in data &&
		typeof data.message === "string"
	) {
		return data.message;
	}

	return fallback;
}

async function toggleActivityArchivedAction(
	formData: FormData,
) {
	const activityId = formData.get(
		"activityId",
	);
	if (
		typeof activityId !== "string" ||
		!activityId
	) {
		return;
	}

	const archived =
		formData.get("archived") === "1";
	const response = await fetch(
		"/api/admin/activities",
		{
			method: "PATCH",
			headers: {
				"Content-Type":
					"application/json",
			},
			body: JSON.stringify({
				activityId,
				archived,
			}),
		},
	);

	const data =
		(await response.json()) as {
			message?: string;
		};
	if (!response.ok) {
		throw new Error(
			getMessage(
				data,
				"Impossible de mettre à jour le statut de l'activité.",
			),
		);
	}
}

async function deleteActivityAction(
	formData: FormData,
) {
	const activityId = formData.get(
		"activityId",
	);
	if (
		typeof activityId !== "string" ||
		!activityId
	) {
		return;
	}

	const response = await fetch(
		"/api/admin/activities",
		{
			method: "DELETE",
			headers: {
				"Content-Type":
					"application/json",
			},
			body: JSON.stringify({
				activityId,
			}),
		},
	);

	const data =
		(await response.json()) as {
			message?: string;
		};
	if (!response.ok) {
		throw new Error(
			getMessage(
				data,
				"Impossible de supprimer l'activité.",
			),
		);
	}
}

export default function ActivitiesAdminPage() {
	const [query, setQuery] =
		useState("");
	const [
		debouncedQuery,
		setDebouncedQuery,
	] = useState("");

	const {
		activities,
		isLoading,
		page,
		totalActivities,
		totalPages,
		refresh,
		goToPreviousPage,
		goToNextPage,
	} = useAdminActivities(
		debouncedQuery,
	);

	useEffect(() => {
		const timeoutId = window.setTimeout(
			() => {
				setDebouncedQuery(query);
			},
			300,
		);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [query]);

	const searchActive =
		debouncedQuery.trim().length > 0;

	return (
		<div className="space-y-6 sm:space-y-8">
			<Toaster
				richColors
				position="top-right"
				closeButton
			/>

			<section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex items-center gap-3">
					<h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
						Liste des activités
					</h2>
					<span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-100 px-3 text-sm font-bold text-orange-600">
						{totalActivities}
					</span>
				</div>
				<div className="flex w-full flex-col justify-end gap-3 sm:w-auto sm:flex-row sm:items-center">
					<Link
						href="/admin/activities/new"
						className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.3)] no-underline transition hover:brightness-105 sm:w-auto">
						<Plus size={16} />
						Nouvelle activité
					</Link>
					<Link
						href="/admin/activities/logs"
						className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 no-underline transition hover:bg-gray-50 sm:w-auto">
						<Clock3 size={16} />
						Voir les logs
					</Link>
				</div>
			</section>

			<section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
				<div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
					<AdminSearchInput
						value={query}
						onChange={setQuery}
						placeholder="Rechercher par titre, auteur ou catégorie..."
					/>

					<PaginationControls
						summary={`Page ${page} sur ${totalPages} - ${totalActivities} activité${totalActivities > 1 ? "s" : ""}`}
						currentPage={page}
						totalPages={totalPages}
						isPreviousDisabled={
							isLoading || page <= 1
						}
						isNextDisabled={
							isLoading ||
							page >= totalPages
						}
						onPrevious={
							goToPreviousPage
						}
						onNext={goToNextPage}
						className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-between"
					/>
				</div>

				{isLoading &&
				activities.length === 0 ? (
					<p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
						Chargement des activités...
					</p>
				) : activities.length === 0 ? (
					<p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
						{searchActive
							? "Aucune activité ne correspond à votre recherche."
							: "Aucune activité disponible pour le moment."}
					</p>
				) : (
					<>
						<div className="mt-6 space-y-4 md:hidden">
							{activities.map(
								(activity) => {
									const isArchived =
										activity.status ===
										"ARCHIVED";

									return (
										<article
											key={activity.id}
											className="rounded-2xl border border-gray-200 p-4 shadow-xs">
											<div className="flex items-start justify-between gap-3">
												<p className="line-clamp-2 text-sm font-semibold text-gray-900">
													{
														activity.title
													}
												</p>
												<span
													className={[
														"inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
														statusBadgeClassName(
															activity.status,
														),
													].join(" ")}>
													{statusLabel(
														activity.status,
													)}
												</span>
											</div>

											<div className="mt-3 space-y-3 text-sm text-gray-700">
												<p>
													<span className="font-semibold text-gray-900">
														Auteur(e):{" "}
													</span>
													{
														activity.author
													}
												</p>
												<p>
													<span className="font-semibold text-gray-900">
														Catégorie:{" "}
													</span>
													{activity.tag}
												</p>
											</div>

											<div className="mt-4 flex min-w-0 items-center gap-2">
												<Link
													href={`/admin/activities/preview/${activity.id}`}
													aria-label={`Aperçu de l'activité ${activity.title}`}
													className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 no-underline transition hover:bg-slate-100">
													<Eye size={14} />
												</Link>
												<Link
													href={`/admin/activities/edit/${activity.id}`}
													aria-label={`Modifier l'activité ${activity.title}`}
													className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 no-underline transition hover:bg-blue-100">
													<Pencil
														size={14}
													/>
												</Link>

												<form
													action={async (
														formData,
													) => {
														try {
															await toggleActivityArchivedAction(
																formData,
															);
															refresh();
														} catch (error) {
															toast.error(
																error instanceof
																	Error
																	? error.message
																	: "Impossible de mettre à jour le statut de l'activité.",
															);
														}
													}}
													className="min-w-0 flex-1">
													<input
														type="hidden"
														name="activityId"
														value={
															activity.id
														}
													/>
													<input
														type="hidden"
														name="archived"
														value={
															isArchived
																? "0"
																: "1"
														}
													/>
													<button
														type="submit"
														className={[
															"inline-flex h-10 w-full min-w-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
															toggleButtonClassName(
																!isArchived,
															),
														].join(
															" ",
														)}>
														<Power
															size={14}
															className="shrink-0"
														/>
														<span className="min-w-0 truncate">
															{isArchived
																? "Publier"
																: "Archiver"}
														</span>
													</button>
												</form>

												<DeleteActivityButton
													activityId={
														activity.id
													}
													activityTitle={
														activity.title
													}
													deleteAction={async (
														formData,
													) => {
														await deleteActivityAction(
															formData,
														);
														refresh();
													}}
													className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-100 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
												/>
											</div>
										</article>
									);
								},
							)}
						</div>

						<div className="mt-6 hidden overflow-hidden md:block">
							<table className="w-full table-auto border-separate border-spacing-0">
								<thead>
									<tr className="text-sm font-semibold text-gray-700">
										<th className="w-[25%] max-w-56 px-3 py-3 text-left">
											Titre
										</th>
										<th className="px-3 py-3 text-left">
											Auteur
										</th>
										<th className="px-3 py-3 text-left">
											Catégorie
										</th>
										<th className="px-3 py-3 text-center">
											Status
										</th>
										<th className="px-3 py-3 text-right">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{activities.map(
										(activity) => {
											const isArchived =
												activity.status ===
												"ARCHIVED";

											return (
												<tr
													key={
														activity.id
													}
													className="border-t border-gray-100">
													<td className="max-w-0 px-3 py-5 text-sm font-medium text-gray-900">
														<span
															className="block truncate"
															title={
																activity.title
															}>
															{
																activity.title
															}
														</span>
													</td>
													<td className="px-3 py-5 text-sm text-gray-700">
														{
															activity.author
														}
													</td>
													<td className="px-3 py-5 text-sm text-gray-700">
														{
															activity.tag
														}
													</td>
													<td className="px-3 py-5 text-sm text-center">
														<span
															className={[
																"inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
																statusBadgeClassName(
																	activity.status,
																),
															].join(
																" ",
															)}>
															{statusLabel(
																activity.status,
															)}
														</span>
													</td>
													<td className="px-3 py-5 text-sm">
														<div className="flex flex-wrap items-center justify-end gap-2">
															<Link
																href={`/admin/activities/preview/${activity.id}`}
																className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-100">
																<Eye size={14} />
																Aperçu
															</Link>
															<Link
																href={`/admin/activities/edit/${activity.id}`}
																className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 no-underline transition hover:bg-violet-100">
																<Pencil
																	size={
																		14
																	}
																/>
																Modifier
															</Link>

															<form
																action={async (
																	formData,
																) => {
																	try {
																		await toggleActivityArchivedAction(
																			formData,
																		);
																		refresh();
																	} catch (error) {
																		toast.error(
																			error instanceof
																				Error
																				? error.message
																				: "Impossible de mettre à jour le statut de l'activité.",
																		);
																	}
																}}
																className="inline-flex shrink-0">
																<input
																	type="hidden"
																	name="activityId"
																	value={
																		activity.id
																	}
																/>
																<input
																	type="hidden"
																	name="archived"
																	value={
																		isArchived
																			? "0"
																			: "1"
																	}
																/>
																<button
																	type="submit"
																	className={[
																		"inline-flex min-w-30 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
																		toggleButtonClassName(
																			!isArchived,
																		),
																	].join(
																		" ",
																	)}>
																	<Power
																		size={
																			14
																		}
																		className="shrink-0"
																	/>
																	<span className="min-w-0 text-center">
																		{isArchived
																			? "Publier"
																			: "Archiver"}
																	</span>
																</button>
															</form>

															<DeleteActivityButton
																activityId={
																	activity.id
																}
																activityTitle={
																	activity.title
																}
																deleteAction={async (
																	formData,
																) => {
																	await deleteActivityAction(
																		formData,
																	);
																	refresh();
																}}
																className="inline-flex w-5 items-center justify-center text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
															/>
														</div>
													</td>
												</tr>
											);
										},
									)}
								</tbody>
							</table>
						</div>
					</>
				)}
			</section>
		</div>
	);
}
