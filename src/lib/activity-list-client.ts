import type {
	Activity,
	ActivityCategory,
	ActivityDifficulty,
	ActivityDurationFilter,
} from "@/lib/activities";

/** Paramètre d’URL pour la recherche (partageable / historique). */
export const ACTIVITIES_SEARCH_PARAM = "q";

/** Paramètre d’URL pour le filtre difficulté (valeurs : Facile, Moyen, Difficile). */
export const ACTIVITIES_DIFFICULTY_PARAM = "difficulty";

/** Paramètre d’URL pour la durée en minutes (15, 30, 45, 60). */
export const ACTIVITIES_DURATION_PARAM = "duration";

export function activityMatchesQuery(
	activity: Activity,
	rawQuery: string,
): boolean {
	const q = rawQuery.trim().toLowerCase();
	if (!q) return true;
	const haystack = [
		activity.title,
		activity.description,
		activity.category,
	]
		.join(" ")
		.toLowerCase();
	return haystack.includes(q);
}

export function filterActivitiesForListing(
	activities: Activity[],
	query: string,
	category: ActivityCategory | null,
	difficulty: ActivityDifficulty | null,
	durationFilter: ActivityDurationFilter | null,
): Activity[] {
	return activities.filter((a) => {
		if (!activityMatchesQuery(a, query)) return false;
		if (category !== null && a.category !== category) {
			return false;
		}
		if (
			difficulty !== null &&
			a.difficulty !== difficulty
		) {
			return false;
		}
		if (
			durationFilter !== null &&
			a.durationMinutes !== durationFilter
		) {
			return false;
		}
		return true;
	});
}

export function getActivitiesResultLine(input: {
	isLoading: boolean;
	total: number;
	count: number;
	query: string;
	category: ActivityCategory | null;
	difficulty: ActivityDifficulty | null;
	durationFilter: ActivityDurationFilter | null;
}): string {
	const {
		isLoading,
		total,
		count,
		query,
		category,
		difficulty,
		durationFilter,
	} = input;
	const noQuery = !query.trim();

	if (isLoading) {
		return "Chargement des activités...";
	}
	if (total === 0) {
		return "Aucune activité disponible pour le moment";
	}
	if (count === 0) {
		if (noQuery) {
			const filterCount = [
				category !== null,
				difficulty !== null,
				durationFilter !== null,
			].filter(Boolean).length;
			if (filterCount >= 2) {
				return "Aucune activité pour cette combinaison de filtres";
			}
			if (category !== null) {
				return "Aucune activité dans cette catégorie";
			}
			if (difficulty !== null) {
				return "Aucune activité pour ce niveau";
			}
			if (durationFilter !== null) {
				return "Aucune activité pour cette durée";
			}
		}
		return "Aucune activité ne correspond à votre recherche";
	}
	if (count === 1) {
		return "1 activité disponible";
	}
	return `${count} activités disponibles`;
}
