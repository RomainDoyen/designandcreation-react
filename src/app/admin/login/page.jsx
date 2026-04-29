"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configError = searchParams.get("e") === "config";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Connexion refusée.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <div className="admin-login__brand-mark" aria-hidden>
            <i className="fas fa-lock" />
          </div>
          <h1 className="admin-login__brand-title">Espace administration</h1>
          <p className="admin-login__brand-sub">Design And Creation</p>
        </div>

        {configError ? (
          <div className="admin-login__config" role="alert">
            Configuration incomplète : définis <strong>SESSION_SECRET</strong>{" "}
            (32 caractères minimum) et{" "}
            <strong>ADMIN_PASSWORD_HASH_B64</strong> dans les variables
            d’environnement (voir <code style={{ fontSize: "0.8em" }}>.env.example</code>
            ).
          </div>
        ) : null}

        <form onSubmit={submit}>
          <label className="admin-login__label" htmlFor="admin-password">
            Mot de passe
          </label>
          <input
            id="admin-password"
            className="admin-login__input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error ? (
            <div className="admin-login__error" role="alert">
              {error}
            </div>
          ) : null}
          <button className="admin-login__submit" type="submit" disabled={busy}>
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="admin-login__hint">
          <Link href="/">← Retour au site public</Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-login">
          <p className="admin-login__fallback">Chargement…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
