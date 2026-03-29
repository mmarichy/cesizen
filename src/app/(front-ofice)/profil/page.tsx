import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ProfilPage } from "@/components/profil/profil-page";

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

  return (
    <ProfilPage
      user={{
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
      }}
    />
  );
}
