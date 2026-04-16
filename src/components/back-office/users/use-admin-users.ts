"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type AdminUser } from "@/components/back-office/users/users-shared";

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "USER" | "ADMIN";
};

function getMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingStatusUserId, setPendingStatusUserId] = useState<string | null>(null);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    toast.dismiss();
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer les utilisateurs");
      }

      const data = (await response.json()) as AdminUser[];
      setUsers(data);
    } catch (error) {
      console.error(error);
      setUsers([]);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const createUser = useCallback(async (payload: CreateUserInput) => {
    clearMessages();

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as AdminUser | { message?: string };

    if (!response.ok) {
      throw new Error(getMessage(data, "Impossible de créer l'utilisateur."));
    }

    setUsers((currentUsers) => [data as AdminUser, ...currentUsers]);
    toast.success("Utilisateur créé avec succès.");
    return data as AdminUser;
  }, [clearMessages]);

  const toggleUserStatus = useCallback(async (user: AdminUser) => {
    try {
      setPendingStatusUserId(user.id);
      clearMessages();

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          isActive: !user.isActive,
        }),
      });

      const data = (await response.json()) as AdminUser | { message?: string };

      if (!response.ok) {
        throw new Error(getMessage(data, "Impossible de mettre à jour le statut."));
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id ? (data as AdminUser) : currentUser,
        ),
      );

      toast.success(
        user.isActive
          ? "Utilisateur désactivé avec succès."
          : "Utilisateur activé avec succès.",
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de mettre à jour le statut.",
      );
    } finally {
      setPendingStatusUserId(null);
    }
  }, [clearMessages]);

  const deleteUser = useCallback(async (user: AdminUser) => {
    try {
      setPendingDeleteUserId(user.id);
      clearMessages();

      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(getMessage(data, "Impossible de supprimer l'utilisateur."));
      }

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );
      toast.success("Utilisateur supprimé avec succès.");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer l'utilisateur.",
      );
      throw error;
    } finally {
      setPendingDeleteUserId(null);
    }
  }, [clearMessages]);

  const notifyPasswordUpdated = useCallback(() => {
    toast.success("Mot de passe mis à jour avec succès.");
  }, []);

  return {
    users,
    isLoading,
    pendingStatusUserId,
    pendingDeleteUserId,
    createUser,
    toggleUserStatus,
    deleteUser,
    clearMessages,
    notifyPasswordUpdated,
  };
}
