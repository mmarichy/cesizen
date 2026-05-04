import { PrismaClient } from "@/app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
  pool: Pool | undefined;
};

function setArchivedAtIfNeeded(
  data: Record<string, unknown> | undefined,
) {
  if (!data || data.status !== "ARCHIVED") {
    return;
  }

  if (!data.archivedAt) {
    data.archivedAt = new Date();
  }
}

function createPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/cesizen";

  const pool = globalForPrisma.pool ?? new Pool({ connectionString });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async $allOperations({
          model,
          operation,
          args,
          query,
        }: {
          model?: string;
          operation: string;
          args: Record<string, unknown>;
          query: (args: Record<string, unknown>) => Promise<unknown>;
        }) {
          if (model === "Article" || model === "Activity") {
            if (operation === "create" || operation === "update" || operation === "updateMany") {
              setArchivedAtIfNeeded(args.data as Record<string, unknown> | undefined);
            }

            if (operation === "upsert") {
              setArchivedAtIfNeeded(args.create as Record<string, unknown> | undefined);
              setArchivedAtIfNeeded(args.update as Record<string, unknown> | undefined);
            }
          }

          return query(args);
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
