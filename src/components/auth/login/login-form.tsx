"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const inputIconClass = "absolute left-3 size-1.125rem text-emerald-600 pointer-events-none";
const fieldClass =
  "w-full rounded-xl border border-transparent bg-gray-200 py-3 pl-10 pr-3 text-sm text-gray-800 placeholder:text-gray-600 outline-none ring-emerald-600/40 transition-shadow focus:ring-2 disabled:opacity-60";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setSuccess("Compte créé. Vous pouvez maintenant vous connecter.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email ou mot de passe incorrect.");
        return;
      }

      if (res?.ok) {
        const callbackUrl = searchParams.get("callbackUrl");
        const redirectTo =
          callbackUrl &&
          callbackUrl.startsWith("/") &&
          !callbackUrl.startsWith("//") &&
          !callbackUrl.includes("://")
            ? callbackUrl
            : "/profil";
        router.push(redirectTo);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center lg:text-left">
        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">Connexion</h2>
        <p className="text-sm text-gray-500 md:text-base">Accédez à votre espace CESIZen</p>
      </div>

      {success ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          {success}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-gray-700">Email</span>
          <span className="relative flex items-center">
            <Mail className={inputIconClass} aria-hidden />
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
          <span className="text-xs font-medium text-gray-700">Mot de passe</span>
          <span className="relative flex items-center">
            <Lock className={inputIconClass} aria-hidden />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              required
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

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <Link
            href="/auth/register"
            className="font-medium text-emerald-600 no-underline hover:underline"
          >
            Pas encore de compte ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/35 transition-transform active:scale-[0.99] hover:brightness-105 disabled:opacity-60 md:text-base"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
