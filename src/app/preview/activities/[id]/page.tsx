import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ActivityPreviewContent } from "@/components/preview/activity-preview-content";

export const dynamic = "force-dynamic";

export default async function ActivityPreviewEmbedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      content: true,
      tag: true,
      difficulty: true,
      duration: true,
      status: true,
      author: true,
    },
  });

  if (!activity) {
    notFound();
  }

  return (
    <ActivityPreviewContent
      title={activity.title}
      description={activity.description}
      content={activity.content}
      tag={activity.tag}
      difficulty={activity.difficulty}
      duration={activity.duration}
      status={activity.status}
      author={activity.author}
    />
  );
}
