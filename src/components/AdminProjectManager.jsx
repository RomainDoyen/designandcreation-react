"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function ImagePreviewLightbox({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="admin-img-preview"
      role="dialog"
      aria-modal="true"
      aria-label="Aperçu image"
      onClick={onClose}
    >
      <div
        className="admin-img-preview__inner"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="admin-img-preview__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <img src={src} alt="" className="admin-img-preview__img" />
      </div>
    </div>,
    document.body,
  );
}

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
  const [previewSrc, setPreviewSrc] = useState(null);

  const closePreview = useCallback(() => setPreviewSrc(null), []);

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
      {previewSrc ? (
        <ImagePreviewLightbox src={previewSrc} onClose={closePreview} />
      ) : null}
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
        <div className="admin-manage-table-wrap">
          <table className="admin-manage-table">
            <thead>
              <tr>
                <th scope="col" className="admin-manage-table__th admin-manage-table__th--thumb">
                  Aperçu
                </th>
                <th scope="col" className="admin-manage-table__th">
                  ID
                </th>
                <th scope="col" className="admin-manage-table__th">
                  Création
                </th>
                <th scope="col" className="admin-manage-table__th">
                  Ordre
                </th>
                <th scope="col" className="admin-manage-table__th admin-manage-table__th--file">
                  Remplacer
                </th>
                <th scope="col" className="admin-manage-table__th admin-manage-table__th--actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="admin-manage-table__row">
                  <td className="admin-manage-table__td admin-manage-table__td--thumb">
                    <button
                      type="button"
                      className="admin-manage-table__thumb-btn"
                      onClick={() => setPreviewSrc(item.imageUrl)}
                      aria-label="Afficher l’image en grand"
                      title="Cliquer pour agrandir"
                    >
                      <span className="admin-manage-table__thumb">
                        <img src={item.imageUrl} alt="" loading="lazy" />
                      </span>
                    </button>
                  </td>
                  <td className="admin-manage-table__td">
                    <code className="admin-manage-table__id" title={item.id}>
                      {item.id.slice(0, 8)}…
                    </code>
                  </td>
                  <td className="admin-manage-table__td admin-manage-table__td--date">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="admin-manage-table__td">
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
                  </td>
                  <td className="admin-manage-table__td">
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
                  </td>
                  <td className="admin-manage-table__td admin-manage-table__td--actions">
                    <button
                      type="button"
                      className="admin-manage-btn admin-manage-btn--danger"
                      disabled={busyId === item.id}
                      onClick={() => remove(item.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          Tableau par type (dessins / logos) : <strong>ordre</strong> (nombre puis
          « Appliquer » ou clic hors champ), <strong>remplacement</strong> d’image
          (colonne fichier), ou <strong>suppression</strong>. Défile horizontalement
          sur mobile si besoin.
        </p>
      </div>
      <KindSection kind="draw" title="Dessins" />
      <KindSection kind="logo" title="Logos" />
    </div>
  );
}
