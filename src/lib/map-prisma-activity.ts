import type { Activity as PrismaActivity } from "@/app/generated/prisma";
import {
	ActivityDuration,
	DifficultyLevel,
} from "@/app/generated/prisma";
import {
	activityTagToCategory,
	type Activity,
} from "@/lib/activities";

function difficultyToUi(
	level: DifficultyLevel,
): Activity["difficulty"] {
	switch (level) {
		case DifficultyLevel.EASY:
			return "Facile";
		case DifficultyLevel.MEDIUM:
			return "Moyen";
		case DifficultyLevel.HARD:
			return "Difficile";
	}
}

function durationToMinutes(
	duration: ActivityDuration,
): number {
	switch (duration) {
		case ActivityDuration.MIN_15:
			return 15;
		case ActivityDuration.MIN_30:
			return 30;
		case ActivityDuration.MIN_45:
			return 45;
		case ActivityDuration.HOUR_1:
			return 60;
	}
}

export function mapPrismaActivityToDto(
	row: PrismaActivity,
): Activity {
	const { label, accentColor } = activityTagToCategory(
		row.tag,
	);
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		category: label,
		accentColor,
		difficulty: difficultyToUi(row.difficulty),
		durationMinutes: durationToMinutes(row.duration),
	};
}
