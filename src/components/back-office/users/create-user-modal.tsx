"use client";

import { useState } from "react";
import { Eye, EyeOff, UserPlus, X } from "lucide-react";
import { type AdminUser } from "@/components/back-office/users/users-shared";

const MIN_PASSWORD = 8;

type CreateUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "USER" | "ADMIN";
};

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreateUser: (payload: CreateUserForm) => Promise<AdminUser>;
};

const initialCreateUserForm: CreateUserForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "USER",
};

export function CreateUserModal({
  open,
  onClose,
  onCreateUser,
}: CreateUserModalProps) {
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showCreateConfirmPassword, setShowCreateConfirmPassword] = useState(false);
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>(initialCreateUserForm);

  const updateCreateUserForm = <K extends keyof CreateUserForm>(
    field: K,
    value: CreateUserForm[K],
  ) => {
    setCreateUserForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetAndClose = () => {
    setCreateErrorMessage(null);
    setIsCreatingUser(false);
    setCreateUserForm(initialCreateUserForm);
    setShowCreatePassword(false);
    setShowCreateConfirmPassword(false);
    onClose();
  };

  const handleCreateUser = async () => {
    const email = createUserForm.email.trim();
    const firstName = createUserForm.firstName.trim();
    const lastName = createUserForm.lastName.trim();

    if (!email || !firstName || !lastName) {
      setCreateErrorMessage("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setCreateErrorMessage("L'adresse email n'est pas valide.");
      return;
    }

    if (createUserForm.password.length < MIN_PASSWORD) {
      setCreateErrorMessage(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.`,
      );
      return;
    }

    if (!/[A-Z]/.test(createUserForm.password)) {
      setCreateErrorMessage("Le mot de passe doit contenir au moins une lettre majuscule.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`’€£§]/.test(createUserForm.password)) {
      setCreateErrorMessage("Le mot de passe doit contenir au moins un caractère spécial.");
      return;
    }

    if (createUserForm.password !== createUserForm.confirmPassword) {
      setCreateErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setIsCreatingUser(true);
      setCreateErrorMessage(null);

      await onCreateUser({
        ...createUserForm,
        email,
        firstName,
        lastName,
      });
      resetAndClose();
    } catch (error) {
      console.error(error);
      setCreateErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de créer l'utilisateur.",
      );
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-3 py-3 backdrop-blur-xs sm:px-4 sm:py-6">
      <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:rounded-3xl sm:p-6">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 sm:h-12 sm:w-12">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Ajouter un utilisateur</h3>
              <p className="mt-1 text-sm text-gray-600 sm:mt-2">
                Créez un nouveau compte administrateur ou utilisateur.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            disabled={isCreatingUser}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
            aria-label="Fermer la fenêtre de création"
          >
            <X size={18} />
          </button>
        </div>

        {createErrorMessage ? (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mt-6">
            {createErrorMessage}
          </p>
        ) : null}

        <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-700">Prénom</span>
            <input
              type="text"
              value={createUserForm.firstName}
              onChange={(event) => {
                updateCreateUserForm("firstName", event.target.value);
              }}
              disabled={isCreatingUser}
              placeholder="Jean"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-700">Nom</span>
            <input
              type="text"
              value={createUserForm.lastName}
              onChange={(event) => {
                updateCreateUserForm("lastName", event.target.value);
              }}
              disabled={isCreatingUser}
              placeholder="Dupont"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Email</span>
            <input
              type="email"
              value={createUserForm.email}
              onChange={(event) => {
                updateCreateUserForm("email", event.target.value);
              }}
              disabled={isCreatingUser}
              placeholder="jean.dupont@email.com"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-700">Téléphone</span>
            <input
              type="tel"
              value={createUserForm.phone}
              onChange={(event) => {
                updateCreateUserForm("phone", event.target.value);
              }}
              disabled={isCreatingUser}
              placeholder="06 12 34 56 78"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-700">Rôle</span>
            <select
              value={createUserForm.role}
              onChange={(event) => {
                updateCreateUserForm("role", event.target.value as "USER" | "ADMIN");
              }}
              disabled={isCreatingUser}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-hidden transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="USER">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-700">Mot de passe</span>
            <span className="relative block">
              <input
                type={showCreatePassword ? "text" : "password"}
                value={createUserForm.password}
                onChange={(event) => {
                  updateCreateUserForm("password", event.target.value);
                }}
                disabled={isCreatingUser}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCreatePassword((current) => !current);
                }}
                disabled={isCreatingUser}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showCreatePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showCreatePassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-700">Confirmer le mot de passe</span>
            <span className="relative block">
              <input
                type={showCreateConfirmPassword ? "text" : "password"}
                value={createUserForm.confirmPassword}
                onChange={(event) => {
                  updateCreateUserForm("confirmPassword", event.target.value);
                }}
                disabled={isCreatingUser}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCreateConfirmPassword((current) => !current);
                }}
                disabled={isCreatingUser}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showCreateConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
              >
                {showCreateConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 sm:mt-6">
          <p className="text-sm font-semibold text-amber-700">Règles du mot de passe</p>
          <p className="mt-1 text-sm text-amber-600">
            Minimum 8 caractères, avec au moins une majuscule et un caractère spécial.
          </p>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={resetAndClose}
            disabled={isCreatingUser}
            className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              void handleCreateUser();
            }}
            disabled={isCreatingUser}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            <UserPlus size={16} />
            {isCreatingUser ? "Création..." : "Créer l'utilisateur"}
          </button>
        </div>
      </div>
    </div>
  );
}
