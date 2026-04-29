import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { BackOfficeHeader } from "@/components/back-office/layout/back-office-header";
import { BackOfficeNav } from "@/components/back-office/layout/back-office-nav";

export default async function BackOfficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/admin/dashboard");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/profil");
  }

  const adminName = session.user.name?.trim() || "Administrateur";

  return (
    <div
      className="min-h-screen pb-8 sm:pb-10"
      style={{
        background:
          "linear-gradient(135deg, #FFFBEB 0%, #FFF7ED 50%, #FEFCE8 100%)",
      }}
    >
      <main className="mx-auto w-full max-w-6xl px-3 pt-2 pb-28 sm:px-4 sm:pb-10">
        <div className="relative px-0 pb-8 pt-3 sm:px-6 sm:pb-12 sm:pt-5">
          <BackOfficeHeader adminName={adminName} />

          <div className="mx-auto mt-6 max-w-3xl text-center sm:mt-10">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:mt-4 sm:text-5xl">Administration</h1>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Gérez les utilisateurs, les articles et les activités de la plateforme
            </p>

            <BackOfficeNav adminRoot="/admin" />
          </div>
        </div>
        <section className="mt-6 sm:mt-8">{children}</section>
      </main>
    </div>
  );
}
