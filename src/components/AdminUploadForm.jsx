"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const labels = {
  draw: { title: "Dessins", noun: "dessin", icon: "fa-image" },
  logo: { title: "Logos", noun: "logo", icon: "fa-vector-square" },
};

export default function AdminUploadForm({ kind }) {
  const meta = labels[kind] ?? {
    title: kind,
    noun: kind,
    icon: "fa-file-image",
  };
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (files.length === 0) {
      setPreviewUrls([]);
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const upload = async () => {
    if (files.length === 0) {
      setMessageKind("err");
      setMessage("Choisis au moins une image.");
      return;
    }
    setBusy(true);
    setMessage("");
    setMessageKind("");
    try {
      const fd = new FormData();
      fd.append("kind", kind);
      for (const f of files) {
        fd.append("file", f);
      }
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessageKind("err");
        setMessage(data.error || "Échec de l’upload.");
        if (Array.isArray(data.failed) && data.failed.length) {
          setMessage(
            (data.error || "Échec.") +
              " " +
              data.failed.map((f) => `${f.name}: ${f.error}`).join(" · "),
          );
        }
        return;
      }
      const n = data.projects?.length ?? 0;
      const failed = data.failed ?? [];
      if (failed.length === 0) {
        setMessageKind("ok");
        setMessage(
          n <= 1
            ? "Image enregistrée — elle apparaît sur la page publique."
            : `${n} images enregistrées — elles apparaissent sur la page publique.`,
        );
      } else {
        setMessageKind("ok");
        setMessage(
          `${n} image(s) enregistrée(s). Échecs : ${failed
            .map((f) => `${f.name} (${f.error})`)
            .join(" · ")}`,
        );
      }
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setMessageKind("err");
      setMessage("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  };

  const openPicker = () => inputRef.current?.click();

  const count = files.length;
  const dropSummary =
    count === 0
      ? "Glisse une ou plusieurs images ou clique pour parcourir"
      : count === 1
        ? files[0].name
        : `${count} fichiers sélectionnés`;
  const dropHint =
    count === 0
      ? "Sélection multiple possible (Ctrl/Cmd + clic)"
      : "Tu peux remplacer la sélection en cliquant à nouveau";

  return (
    <div className="admin-upload">
      <h1 className="admin-upload__title">Upload {meta.title}</h1>
      <p className="admin-upload__subtitle">
        JPEG, PNG, GIF ou Webp — max. 12&nbsp;Mo par fichier, jusqu’à 40 fichiers
        d’un coup. Fichiers sur <strong>Vercel Blob</strong>, métadonnées dans{" "}
        <strong>Neon</strong> pour la galerie « {kind === "draw" ? "dessins" : "logos"} ».
        Store <strong>privé</strong> (défaut) : URL interne{" "}
        <code>/api/blob-file/…</code>. Store public Vercel : ajoute{" "}
        <code>BLOB_ACCESS=public</code> dans l’env pour enregistrer l’URL directe du
        fichier.
      </p>

      <input
        ref={inputRef}
        id="admin-file"
        className="admin-upload__input"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(e) => {
          const list = e.target.files ? Array.from(e.target.files) : [];
          setFiles(list);
          setMessage("");
          setMessageKind("");
        }}
      />
      <label
        htmlFor="admin-file"
        className={`admin-upload__drop${count ? " has-file" : ""}`}
      >
        <span className="admin-upload__drop-icon" aria-hidden>
          <i className={`fas ${meta.icon}`} />
        </span>
        <span className="admin-upload__drop-text">{dropSummary}</span>
        <span className="admin-upload__drop-hint">{dropHint}</span>
      </label>

      {previewUrls.length > 0 ? (
        <div
          className={
            previewUrls.length === 1
              ? "admin-upload__preview"
              : "admin-upload__preview-grid"
          }
        >
          {previewUrls.map((url, i) => (
            <div key={`${url}-${i}`} className="admin-upload__preview-cell">
              <img src={url} alt="" />
              {count > 1 ? (
                <span className="admin-upload__preview-name" title={files[i]?.name}>
                  {files[i]?.name}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="admin-upload__actions">
        <button
          type="button"
          className="admin-upload__btn-primary"
          onClick={upload}
          disabled={busy || count === 0}
        >
          {busy
            ? "Envoi en cours…"
            : count <= 1
              ? `Publier ce ${meta.noun}`
              : `Publier ${count} images`}
        </button>
        <button
          type="button"
          className="admin-upload__btn-secondary"
          onClick={openPicker}
          disabled={busy}
        >
          Parcourir…
        </button>
        <Link href="/admin" className="admin-upload__btn-secondary">
          Tableau de bord
        </Link>
      </div>

      {message ? (
        <div
          className={`admin-upload__msg admin-upload__msg--${messageKind === "ok" ? "ok" : "err"}`}
          role="status"
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}
