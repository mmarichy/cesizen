import { ActivityPreviewContent } from "@/components/preview/activity-preview-content";

export const dynamic = "force-dynamic";

export default async function NewActivityPreviewPage({
  searchParams,
}: {
  searchParams?: Promise<{
    title?: string;
    description?: string;
    content?: string;
    tag?: string;
    difficulty?: string;
    duration?: string;
    status?: string;
    author?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <ActivityPreviewContent
      title={params?.title?.trim() || "Titre non renseigné"}
      description={params?.description?.trim() || "Description non renseignée"}
      content={params?.content?.trim() || "_Aucun contenu pour le moment._"}
      tag={params?.tag?.trim() || "relaxation"}
      difficulty={params?.difficulty?.trim() || "EASY"}
      duration={params?.duration?.trim() || "MIN_15"}
      status={params?.status?.trim() || "DRAFT"}
      author={params?.author?.trim() || "Auteur non renseigné"}
    />
  );
}
