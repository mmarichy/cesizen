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

type AdminUsersListResponse = {
  items: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const USERS_PAGE_SIZE = 20;

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

export function useAdminUsers(searchQuery: string) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingStatusUserId, setPendingStatusUserId] = useState<string | null>(null);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);
  const [pendingRoleUserId, setPendingRoleUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const clearMessages = useCallback(() => {
    toast.dismiss();
  }, []);

  const loadUsers = useCallback(async (targetPage: number) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(USERS_PAGE_SIZE),
      });
      const normalizedQuery = searchQuery.trim();
      if (normalizedQuery) {
        params.set("q", normalizedQuery);
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer les utilisateurs");
      }

      const data = (await response.json()) as AdminUsersListResponse;
      setUsers(data.items);
      setTotalUsers(data.pagination.total);
      setTotalPages(Math.max(1, data.pagination.totalPages));

      if (targetPage > data.pagination.totalPages && data.pagination.totalPages > 0) {
        setPage(data.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    void loadUsers(page);
  }, [loadUsers, page]);

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

    toast.success("Utilisateur créé avec succès.");
    setPage(1);
    await loadUsers(1);
    return data as AdminUser;
  }, [clearMessages, loadUsers]);

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
      await loadUsers(page);
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
  }, [clearMessages, loadUsers, page]);

  const toggleUserRole = useCallback(async (user: AdminUser) => {
    try {
      setPendingRoleUserId(user.id);
      clearMessages();

      const nextRole = user.role === "Admin" ? "USER" : "ADMIN";
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          role: nextRole,
        }),
      });

      const data = (await response.json()) as AdminUser | { message?: string };

      if (!response.ok) {
        throw new Error(getMessage(data, "Impossible de mettre à jour le rôle."));
      }

      toast.success(
        nextRole === "ADMIN"
          ? "Utilisateur promu administrateur."
          : "Utilisateur rétrogradé en rôle utilisateur.",
      );
      await loadUsers(page);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de mettre à jour le rôle.",
      );
    } finally {
      setPendingRoleUserId(null);
    }
  }, [clearMessages, loadUsers, page]);

  const notifyPasswordUpdated = useCallback(() => {
    toast.success("Mot de passe mis à jour avec succès.");
  }, []);

  return {
    users,
    isLoading,
    page,
    totalUsers,
    totalPages,
    pendingStatusUserId,
    pendingDeleteUserId,
    pendingRoleUserId,
    createUser,
    toggleUserStatus,
    toggleUserRole,
    deleteUser,
    goToPage: (nextPage: number) => {
      setPage(nextPage);
    },
    goToPreviousPage: () => {
      setPage((currentPage) => Math.max(1, currentPage - 1));
    },
    goToNextPage: () => {
      setPage((currentPage) => Math.min(totalPages, currentPage + 1));
    },
    clearMessages,
    notifyPasswordUpdated,
  };
}
