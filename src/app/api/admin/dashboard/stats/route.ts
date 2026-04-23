import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin-session";
import { getDashboardStats } from "@/lib/admin/dashboard-stats";

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
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
