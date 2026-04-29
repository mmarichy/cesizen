import { NextResponse } from "next/server";
import { StatusType } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { articleTagToCategory, type Article } from "@/lib/articles";

function toSmallDescription(value: string) {
  const trimmed = value.trim();
  if (trimmed.length <= 95) return trimmed;
  return `${trimmed.slice(0, 92).trimEnd()}...`;
}

function toFrenchDate(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export async function GET() {
  try {
    const dbArticles = await prisma.article.findMany({
      where: {
        status: StatusType.PUBLISHED,
        archivedAt: null,
      },
      orderBy: { date: "desc" },
    });

    const articles: Article[] = dbArticles.map((article) => ({
      id: article.id,
      title: article.title,
      category: articleTagToCategory(article.tag),
      smallDescription: toSmallDescription(article.description),
      description: article.content,
      author: article.author,
      date: toFrenchDate(article.date),
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Erreur API /api/articles:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les articles" },
      { status: 500 },
    );
  }
}
