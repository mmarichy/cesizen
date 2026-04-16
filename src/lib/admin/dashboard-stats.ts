import { prisma } from "@/lib/prisma";

type DashboardLatestUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
};

type DashboardLatestArticle = {
  id: string;
  title: string;
  author: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
};

type DashboardLatestActivity = {
  id: string;
  title: string;
  author: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
};

export type DashboardStats = {
  users: {
    total: number;
    admins: number;
    newLast7Days: number;
    latest: DashboardLatestUser[];
  };
  articles: {
    total: number;
    draft: number;
    published: number;
    archived: number;
    latest: DashboardLatestArticle[];
  };
  activities: {
    total: number;
    draft: number;
    published: number;
    archived: number;
    latest: DashboardLatestActivity[];
  };
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function withArchiveStatus<T extends { status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; archivedAt: Date | null }>(
  items: T[],
) {
  return items.map(({ archivedAt, ...item }) => ({
    ...item,
    status: archivedAt ? "ARCHIVED" : item.status,
  }));
}

async function queryDashboardStats(): Promise<DashboardStats> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    userTotal,
    userAdmins,
    userNewLast7Days,
    latestUsers,
    articleTotal,
    articleDraft,
    articlePublished,
    articleArchived,
    latestArticles,
    activityTotal,
    activityDraft,
    activityPublished,
    activityArchived,
    latestActivities,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.article.count(),
    prisma.article.count({ where: { status: "DRAFT", archivedAt: null } }),
    prisma.article.count({ where: { status: "PUBLISHED", archivedAt: null } }),
    prisma.article.count({ where: { archivedAt: { not: null } } }),
    prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        author: true,
        status: true,
        archivedAt: true,
        createdAt: true,
      },
    }),
    prisma.activity.count(),
    prisma.activity.count({ where: { status: "DRAFT", archivedAt: null } }),
    prisma.activity.count({ where: { status: "PUBLISHED", archivedAt: null } }),
    prisma.activity.count({ where: { archivedAt: { not: null } } }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        author: true,
        status: true,
        archivedAt: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    users: {
      total: userTotal,
      admins: userAdmins,
      newLast7Days: userNewLast7Days,
      latest: latestUsers,
    },
    articles: {
      total: articleTotal,
      draft: articleDraft,
      published: articlePublished,
      archived: articleArchived,
      latest: withArchiveStatus(latestArticles),
    },
    activities: {
      total: activityTotal,
      draft: activityDraft,
      published: activityPublished,
      archived: activityArchived,
      latest: withArchiveStatus(latestActivities),
    },
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await queryDashboardStats();
    } catch (error) {
      lastError = error;

      if (attempt === MAX_RETRIES) {
        break;
      }

      // On force la fermeture pour repartir sur une nouvelle connexion DB au retry suivant.
      await prisma.$disconnect().catch(() => undefined);
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Impossible de récupérer les statistiques du dashboard");
}
