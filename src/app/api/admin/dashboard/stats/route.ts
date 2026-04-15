import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { getDashboardStats } from "@/lib/admin/dashboard-stats";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Accès interdit" }, { status: 403 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur API /api/admin/dashboard/stats:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les statistiques du dashboard" },
      { status: 500 },
    );
  }
}
