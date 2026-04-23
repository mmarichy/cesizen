import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

type AdminSession = Session & {
  user: Session["user"] & {
    id: string;
    role: "ADMIN";
  };
};

export type AdminSessionResult =
  | {
      session: null;
      response: NextResponse;
    }
  | {
      session: AdminSession;
      response: null;
    };

export async function requireAdminSession(): Promise<AdminSessionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ message: "Non authentifié" }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      response: NextResponse.json({ message: "Accès interdit" }, { status: 403 }),
    };
  }

  return { session: session as AdminSession, response: null };
}
