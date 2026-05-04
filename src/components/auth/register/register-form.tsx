"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

const inputIconClass = "absolute left-3 size-1.125rem text-emerald-600 pointer-events-none";
const fieldClass =
  "w-full rounded-xl border border-transparent bg-gray-200 py-3 pl-10 pr-3 text-sm text-gray-800 placeholder:text-gray-600 outline-none ring-emerald-600/40 transition-shadow focus:ring-2 disabled:opacity-60";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const confirmPassword = String(fd.get("confirmPassword") ?? "");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          password,
          confirmPassword,
        }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      router.push("/auth/login?registered=1");
      router.refresh();
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center lg:text-left">
        <h2 className="text-xl font-bold text-gray-800 md:text-2xl">Créer un compte</h2>
        <p className="text-sm text-gray-600 md:text-base">Rejoignez la communauté CESIZen</p>
      </div>

      {error ? (
        <p
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-gray-800">Prénom</span>
            <span className="relative flex items-center">
              <User
                className={inputIconClass}
                aria-hidden
              />
              <input
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Jean"
                required
                disabled={loading}
                className={fieldClass}
              />
            </span>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-gray-800">Nom</span>
            <span className="relative flex items-center">
              <User
                className={inputIconClass}
                aria-hidden
              />
              <input
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Dupont"
                required
                disabled={loading}
                className={fieldClass}
              />
            </span>
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-gray-800">Email</span>
          <span className="relative flex items-center">
            <Mail
              className={inputIconClass}
              aria-hidden
            />
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="votre@email.com"
              required
              disabled={loading}
              className={fieldClass}
            />
          </span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-gray-800">Téléphone</span>
          <span className="relative flex items-center">
            <Phone
              className={inputIconClass}
              aria-hidden
            />
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              disabled={loading}
              className={fieldClass}
            />
          </span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-gray-800">Mot de passe</span>
          <span className="relative flex items-center">
            <Lock
              className={inputIconClass}
              aria-hidden
            />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              required
              minLength={8}
              disabled={loading}
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="size-1.125rem" /> : <Eye className="size-1.125rem" />}
            </button>
          </span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-gray-800">Confirmer le mot de passe</span>
          <span className="relative flex items-center">
            <Lock
              className={inputIconClass}
              aria-hidden
            />
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              minLength={8}
              disabled={loading}
              className={fieldClass}
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/35 transition-transform active:scale-[0.99] hover:brightness-105 disabled:opacity-60 md:text-base"
        >
          {loading ? "Création en cours…" : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}
