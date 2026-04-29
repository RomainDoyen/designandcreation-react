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
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const upload = async () => {
    if (!file) {
      setMessageKind("err");
      setMessage("Choisis un fichier image.");
      return;
    }
    setBusy(true);
    setMessage("");
    setMessageKind("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessageKind("err");
        setMessage(data.error || "Échec de l’upload.");
        return;
      }
      setMessageKind("ok");
      setMessage("Image enregistrée — elle apparaît sur la page publique.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setMessageKind("err");
      setMessage("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="admin-upload">
      <h1 className="admin-upload__title">Upload {meta.title}</h1>
      <p className="admin-upload__subtitle">
        JPEG, PNG, GIF ou Webp — max. 12&nbsp;Mo. Fichiers sur{" "}
        <strong>Vercel Blob</strong>, métadonnées dans <strong>Neon</strong> pour
        la galerie « {kind === "draw" ? "dessins" : "logos"} ». Store{" "}
        <strong>privé</strong> (défaut) : URL interne <code>/api/blob-file/…</code>
        . Store public Vercel : ajoute <code>BLOB_ACCESS=public</code> dans
        l’env pour enregistrer l’URL directe du fichier.
      </p>

      <input
        ref={inputRef}
        id="admin-file"
        className="admin-upload__input"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setMessage("");
          setMessageKind("");
        }}
      />
      <label
        htmlFor="admin-file"
        className={`admin-upload__drop${file ? " has-file" : ""}`}
      >
        <span className="admin-upload__drop-icon" aria-hidden>
          <i className={`fas ${meta.icon}`} />
        </span>
        <span className="admin-upload__drop-text">
          {file ? file.name : "Glisse une image ou clique pour parcourir"}
        </span>
        <span className="admin-upload__drop-hint">
          {file ? "Tu peux changer de fichier en cliquant à nouveau" : ""}
        </span>
      </label>

      {previewUrl ? (
        <div className="admin-upload__preview">
          <img src={previewUrl} alt="Aperçu" />
        </div>
      ) : null}

      <div className="admin-upload__actions">
        <button
          type="button"
          className="admin-upload__btn-primary"
          onClick={upload}
          disabled={busy}
        >
          {busy ? "Envoi en cours…" : `Publier ce ${meta.noun}`}
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
