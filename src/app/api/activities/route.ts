import { NextResponse } from "next/server";
import { StatusType } from "@/app/generated/prisma";
import type { Activity } from "@/lib/activities";
import { mapPrismaActivityToDto } from "@/lib/map-prisma-activity";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const rows = await prisma.activity.findMany({
			where: {
				status: StatusType.PUBLISHED,
				archivedAt: null,
			},
			orderBy: { date: "desc" },
		});

		const activities: Activity[] = rows.map(
			mapPrismaActivityToDto,
		);

		return NextResponse.json(activities);
	} catch (error) {
		console.error(
			"Erreur API /api/activities:",
			error,
		);
		return NextResponse.json(
			{
				message:
					"Impossible de récupérer les activités",
			},
			{ status: 500 },
		);
	}
}
