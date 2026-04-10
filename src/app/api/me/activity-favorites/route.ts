import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { StatusType } from "@/app/generated/prisma";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ message: "Non authentifié" },
				{ status: 401 },
			);
		}

		const rows = await prisma.activityFavorite.findMany({
			where: { userId: session.user.id },
			select: { activityId: true },
		});

		return NextResponse.json({
			ids: rows.map((r) => r.activityId),
		});
	} catch (error) {
		console.error(
			"Erreur GET /api/me/activity-favorites:",
			error,
		);
		return NextResponse.json(
			{ message: "Impossible de lire les favoris" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ message: "Non authentifié" },
				{ status: 401 },
			);
		}

		const body = (await request.json()) as {
			activityId?: unknown;
		};
		const activityId =
			typeof body.activityId === "string"
				? body.activityId.trim()
				: "";
		if (!activityId) {
			return NextResponse.json(
				{ message: "activityId requis" },
				{ status: 400 },
			);
		}

		const activity = await prisma.activity.findFirst({
			where: {
				id: activityId,
				status: StatusType.PUBLISHED,
				archivedAt: null,
			},
			select: { id: true },
		});
		if (!activity) {
			return NextResponse.json(
				{ message: "Activité introuvable" },
				{ status: 404 },
			);
		}

		await prisma.activityFavorite.upsert({
			where: {
				userId_activityId: {
					userId: session.user.id,
					activityId,
				},
			},
			create: {
				userId: session.user.id,
				activityId,
			},
			update: {},
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error(
			"Erreur POST /api/me/activity-favorites:",
			error,
		);
		return NextResponse.json(
			{ message: "Impossible d’ajouter le favori" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ message: "Non authentifié" },
				{ status: 401 },
			);
		}

		const activityId =
			new URL(request.url).searchParams.get(
				"activityId",
			) ?? "";
		if (!activityId.trim()) {
			return NextResponse.json(
				{ message: "activityId requis" },
				{ status: 400 },
			);
		}

		await prisma.activityFavorite.deleteMany({
			where: {
				userId: session.user.id,
				activityId: activityId.trim(),
			},
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error(
			"Erreur DELETE /api/me/activity-favorites:",
			error,
		);
		return NextResponse.json(
			{ message: "Impossible de retirer le favori" },
			{ status: 500 },
		);
	}
}
