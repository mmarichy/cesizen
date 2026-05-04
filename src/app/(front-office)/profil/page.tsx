import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { StatusType } from "@/app/generated/prisma";
import { ProfilPage } from "@/components/profil/profil-page";
import { authOptions } from "@/lib/auth-options";
import { mapPrismaActivityToDto } from "@/lib/map-prisma-activity";
import { prisma } from "@/lib/prisma";

export default async function ProfilRoutePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profil");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/auth/login?callbackUrl=/profil");
  }

  const favoriteRows = await prisma.activityFavorite.findMany({
    where: {
      userId: session.user.id,
      activity: {
        status: StatusType.PUBLISHED,
        archivedAt: null,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { activity: true },
  });

  const favoriteActivities = favoriteRows.map((row) =>
    mapPrismaActivityToDto(row.activity),
  );

  return (
    <ProfilPage
      user={{
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
      }}
      favoriteActivities={favoriteActivities}
    />
  );
}
