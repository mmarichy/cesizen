"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  UserCircle2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  PencilLine,
} from "lucide-react";
import { formatFirstname, formatLastname } from "@/lib/format-person-name";

type Props = {
  initialFirstname: string;
  initialLastname: string;
  email: string;
  initialPhone: string;
};

export function ParametreProfilForm({
  initialFirstname,
  initialLastname,
  email,
  initialPhone,
}: Props) {
  const { update: updateSession } = useSession();

  const [baselinePersonal, setBaselinePersonal] = useState(() => ({
    firstname: formatFirstname(initialFirstname),
    lastname: formatLastname(initialLastname),
    phone: initialPhone,
  }));
  const [editingPersonal, setEditingPersonal] = useState(false);

  const [firstname, setFirstname] = useState(() => formatFirstname(initialFirstname));
  const [lastname, setLastname] = useState(() => formatLastname(initialLastname));
  const [phone, setPhone] = useState(initialPhone);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [personalSaveStatus, setPersonalSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [personalSaveMessage, setPersonalSaveMessage] = useState<string | null>(null);

  const [passwordSaveStatus, setPasswordSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [passwordSaveMessage, setPasswordSaveMessage] = useState<string | null>(null);

  async function handleSavePersonal() {
    setPersonalSaveStatus("saving");
    setPersonalSaveMessage(null);

    const f = formatFirstname(firstname);
    const l = formatLastname(lastname);

    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: f,
        lastname: l,
        phone: phone.trim() || null,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };

    if (!res.ok) {
      setPersonalSaveStatus("error");
      setPersonalSaveMessage(data.error ?? "Une erreur est survenue.");
      return;
    }

    setPersonalSaveStatus("success");
    setPersonalSaveMessage("Informations personnelles enregistrées.");
    setFirstname(f);
    setLastname(l);
    setBaselinePersonal({ firstname: f, lastname: l, phone });
    setEditingPersonal(false);

    const displayName = `${f} ${l}`.trim();
    if (displayName) {
      await updateSession({ name: displayName });
    }
  }

  async function handleSavePassword() {
    const wantsPasswordChange =
      currentPassword.length > 0 ||
      newPassword.length > 0 ||
      confirmNewPassword.length > 0;

    if (!wantsPasswordChange) {
      setPasswordSaveStatus("error");
      setPasswordSaveMessage(
        "Renseignez les champs mot de passe pour enregistrer un nouveau mot de passe.",
      );
      return;
    }

    setPasswordSaveStatus("saving");
    setPasswordSaveMessage(null);

    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: baselinePersonal.firstname,
        lastname: baselinePersonal.lastname,
        phone: baselinePersonal.phone.trim() || null,
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };

    if (!res.ok) {
      setPasswordSaveStatus("error");
      setPasswordSaveMessage(data.error ?? "Une erreur est survenue.");
      return;
    }

    setPasswordSaveStatus("success");
    setPasswordSaveMessage("Mot de passe mis à jour.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setEditingPassword(false);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }

  const personalFieldShell = editingPersonal
    ? "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
    : "rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5";
  const personalInputClass = editingPersonal
    ? "w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
    : "w-full bg-transparent text-slate-600 outline-none text-sm cursor-not-allowed";

  const passwordFieldShell = editingPassword
    ? "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
    : "rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5";
  const passwordInputClass = editingPassword
    ? "w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none text-sm"
    : "w-full bg-transparent text-slate-600 placeholder:text-slate-400 outline-none text-sm cursor-not-allowed";

  function cancelPersonalEdit() {
    setFirstname(baselinePersonal.firstname);
    setLastname(baselinePersonal.lastname);
    setPhone(baselinePersonal.phone);
    setEditingPersonal(false);
    setPersonalSaveMessage(null);
    setPersonalSaveStatus("idle");
  }

  function cancelPasswordEdit() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setEditingPassword(false);
    setPasswordSaveMessage(null);
    setPasswordSaveStatus("idle");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }

  return (
    <section
      className="rounded-3xl border p-6 sm:p-8 bg-[#fbfffd] shadow-[0_14px_45px_rgba(16,185,129,0.20)]"
      style={{ borderColor: "#c7f8de" }}
      aria-label="Formulaire des paramètres"
    >
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <article>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-sky-500">
              <UserCircle2 className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 m-0">Informations personnelles</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Prénom</span>
              <div className={`mt-2 flex items-center gap-2 ${personalFieldShell}`}>
                <UserCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  onKeyDown={
                    editingPersonal
                      ? (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSavePersonal();
                        }
                      }
                      : undefined
                  }
                  readOnly={!editingPersonal}
                  required
                  autoComplete="given-name"
                  className={personalInputClass}
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nom</span>
              <div className={`mt-2 flex items-center gap-2 ${personalFieldShell}`}>
                <UserCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  onKeyDown={
                    editingPersonal
                      ? (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSavePersonal();
                        }
                      }
                      : undefined
                  }
                  readOnly={!editingPersonal}
                  required
                  autoComplete="family-name"
                  className={personalInputClass}
                />
              </div>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email (non modifiable)</span>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  value={email}
                  disabled
                  readOnly
                  className="w-full bg-transparent text-slate-400 outline-none text-sm cursor-not-allowed"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Téléphone</span>
              <div className={`mt-2 flex items-center gap-2 ${personalFieldShell}`}>
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={
                    editingPersonal
                      ? (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSavePersonal();
                        }
                      }
                      : undefined
                  }
                  readOnly={!editingPersonal}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  className={personalInputClass}
                />
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-col items-end sm:flex-row sm:flex-wrap sm:items-center sm:justify-end gap-3">
            {!editingPersonal ? (
              <button
                type="button"
                onClick={() => {
                  setEditingPersonal(true);
                  setPersonalSaveMessage(null);
                  setPersonalSaveStatus("idle");
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold text-sm shadow-sm hover:bg-slate-50 transition-colors"
              >
                <PencilLine className="w-4 h-4 shrink-0 text-sky-600" />
                Modifier mes informations personnelles
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancelPersonalEdit}
                  disabled={personalSaveStatus === "saving"}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSavePersonal}
                  disabled={personalSaveStatus === "saving"}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                  style={{ background: "linear-gradient(135deg, #00D177 0%, #00B875 100%)" }}
                >
                  <Save className="w-4 h-4 shrink-0" />
                  {personalSaveStatus === "saving" ? "Enregistrement…" : "Enregistrer"}
                </button>
              </>
            )}
          </div>
          {personalSaveMessage && (
            <p
              className={`mt-3 text-sm font-medium m-0 text-right ${personalSaveStatus === "error" ? "text-red-600" : "text-emerald-700"
                }`}
              role="status"
            >
              {personalSaveMessage}
            </p>
          )}
        </article>

        <div className="h-px bg-slate-200" />

        <article>
          <div className="flex items-center gap-3 mb-3 pt-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-fuchsia-500">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 m-0">Sécurité</h2>
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Mot de passe actuel</span>
              <div className={`mt-2 flex items-center gap-2 ${passwordFieldShell}`}>
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onKeyDown={
                    editingPassword
                      ? (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSavePassword();
                        }
                      }
                      : undefined
                  }
                  readOnly={!editingPassword}
                  placeholder="******"
                  autoComplete="current-password"
                  className={passwordInputClass}
                />
                {editingPassword ? (
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-600"
                    aria-label={showCurrent ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showCurrent ? (
                      <EyeOff className="w-4 h-4 shrink-0" />
                    ) : (
                      <Eye className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                ) : (
                  <span className="w-5 shrink-0" aria-hidden />
                )}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nouveau mot de passe</span>
              <div className={`mt-2 flex items-center gap-2 ${passwordFieldShell}`}>
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={
                    editingPassword
                      ? (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSavePassword();
                        }
                      }
                      : undefined
                  }
                  readOnly={!editingPassword}
                  placeholder="******"
                  autoComplete="new-password"
                  className={passwordInputClass}
                />
                {editingPassword ? (
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-600"
                    aria-label={showNew ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showNew ? (
                      <EyeOff className="w-4 h-4 shrink-0" />
                    ) : (
                      <Eye className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                ) : (
                  <span className="w-5 shrink-0" aria-hidden />
                )}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Confirmer le nouveau mot de passe
              </span>
              <div className={`mt-2 flex items-center gap-2 ${passwordFieldShell}`}>
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  onKeyDown={
                    editingPassword
                      ? (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSavePassword();
                        }
                      }
                      : undefined
                  }
                  readOnly={!editingPassword}
                  placeholder="******"
                  autoComplete="new-password"
                  className={passwordInputClass}
                />
                {editingPassword ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-600"
                    aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4 shrink-0" />
                    ) : (
                      <Eye className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                ) : (
                  <span className="w-5 shrink-0" aria-hidden />
                )}
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-col items-end sm:flex-row sm:flex-wrap sm:items-center sm:justify-end gap-3">
            {!editingPassword ? (
              <button
                type="button"
                onClick={() => {
                  setEditingPassword(true);
                  setPasswordSaveMessage(null);
                  setPasswordSaveStatus("idle");
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold text-sm shadow-sm hover:bg-slate-50 transition-colors"
              >
                <PencilLine className="w-4 h-4 shrink-0 text-fuchsia-600" />
                Modifier mon mot de passe
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancelPasswordEdit}
                  disabled={passwordSaveStatus === "saving"}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => void handleSavePassword()}
                  disabled={passwordSaveStatus === "saving"}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                  style={{ background: "linear-gradient(135deg, #00D177 0%, #00B875 100%)" }}
                >
                  <Save className="w-4 h-4 shrink-0" />
                  {passwordSaveStatus === "saving" ? "Enregistrement…" : "Enregistrer"}
                </button>
              </>
            )}
          </div>

          {passwordSaveMessage && (
            <p
              className={`mt-3 text-sm font-medium m-0 text-right ${passwordSaveStatus === "error" ? "text-red-600" : "text-emerald-700"
                }`}
              role="status"
            >
              {passwordSaveMessage}
            </p>
          )}
        </article>
      </form>
    </section>
  );
}
