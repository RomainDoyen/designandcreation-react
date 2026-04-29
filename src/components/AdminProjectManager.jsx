"use client";

import { useCallback, useEffect, useState } from "react";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

function KindSection({ kind, title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects?kind=${kind}`, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setError("Impossible de charger la liste.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    load();
  }, [load]);

  const patchOrder = async (id, sortOrder) => {
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setMessage(d.error || "Échec mise à jour ordre.");
        return;
      }
      setMessage("Ordre enregistré.");
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setBusyId(null);
    }
  };

  const replaceImage = async (id, file) => {
    if (!file) return;
    setBusyId(id);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setMessage(d.error || "Échec remplacement image.");
        return;
      }
      setMessage("Image remplacée.");
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        "Supprimer définitivement cet élément (base + fichier) ?",
      )
    ) {
      return;
    }
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setMessage(d.error || "Échec suppression.");
        return;
      }
      setMessage("Élément supprimé.");
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="admin-manage-section" aria-labelledby={`manage-${kind}`}>
      <h2 id={`manage-${kind}`} className="admin-manage-section__title">
        {title}
        {!loading ? (
          <span className="admin-manage-section__count">({items.length})</span>
        ) : null}
      </h2>
      {error ? <p className="admin-manage__error">{error}</p> : null}
      {message ? <p className="admin-manage__hint">{message}</p> : null}
      {loading ? (
        <p className="admin-manage__muted">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="admin-manage__muted">Aucun élément pour l’instant.</p>
      ) : (
        <ul className="admin-manage-grid">
          {items.map((item) => (
            <li key={item.id} className="admin-manage-card">
              <div className="admin-manage-card__thumb">
                <img src={item.imageUrl} alt="" loading="lazy" />
              </div>
              <div className="admin-manage-card__meta">
                <span className="admin-manage-card__id" title={item.id}>
                  {item.id.slice(0, 8)}…
                </span>
                <span className="admin-manage-card__date">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <div className="admin-manage-card__row">
                <label className="admin-manage-label" htmlFor={`order-${item.id}`}>
                  Ordre
                </label>
                <div className="admin-manage-order">
                  <input
                    key={`${item.id}-${item.sortOrder}`}
                    id={`order-${item.id}`}
                    type="number"
                    className="admin-manage-input"
                    defaultValue={item.sortOrder}
                    disabled={busyId === item.id}
                    onBlur={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (Number.isNaN(v) || v === item.sortOrder) return;
                      patchOrder(item.id, v);
                    }}
                  />
                  <button
                    type="button"
                    className="admin-manage-btn admin-manage-btn--ghost"
                    disabled={busyId === item.id}
                    onClick={() => {
                      const el = document.getElementById(`order-${item.id}`);
                      const v = parseInt(el?.value, 10);
                      if (Number.isNaN(v)) return;
                      patchOrder(item.id, v);
                    }}
                  >
                    Appliquer
                  </button>
                </div>
              </div>
              <div className="admin-manage-card__row">
                <label className="admin-manage-label" htmlFor={`file-${item.id}`}>
                  Remplacer l’image
                </label>
                <input
                  id={`file-${item.id}`}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="admin-manage-file"
                  disabled={busyId === item.id}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) replaceImage(item.id, f);
                  }}
                />
              </div>
              <div className="admin-manage-card__actions">
                <button
                  type="button"
                  className="admin-manage-btn admin-manage-btn--danger"
                  disabled={busyId === item.id}
                  onClick={() => remove(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function AdminProjectManager() {
  return (
    <div className="admin-manage">
      <div className="admin-manage__intro">
        <h2 className="admin-manage__heading">Gérer la galerie</h2>
        <p className="admin-manage__lead">
          Modifie l’<strong>ordre d’affichage</strong> (nombre puis « Appliquer » ou
          clic hors champ), <strong>remplace</strong> une image (fichier), ou{" "}
          <strong>supprime</strong> une entrée. Les pages publiques se mettent à
          jour après chaque action.
        </p>
      </div>
      <KindSection kind="draw" title="Dessins" />
      <KindSection kind="logo" title="Logos" />
    </div>
  );
}
