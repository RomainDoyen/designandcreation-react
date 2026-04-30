"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const labels = {
  draw: { title: "Dessins", noun: "dessin", icon: "fa-image" },
  logo: { title: "Logos", noun: "logo", icon: "fa-vector-square" },
};

/** Plusieurs requêtes courtes : une seule grosse requête dépasse souvent le délai Vercel (504). 2 fichiers/lot reste raisonnable sur le plan Hobby (~10 s). */
const FILES_PER_REQUEST = 2;

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
  const [uploadBatch, setUploadBatch] = useState(null);
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
    setUploadBatch(null);
    setMessage("");
    setMessageKind("");
    const totalProjects = [];
    const totalFailed = [];
    const batches = Math.ceil(files.length / FILES_PER_REQUEST);

    const failSlice = (slice, errorText) => {
      for (const f of slice) {
        totalFailed.push({ name: f.name, error: errorText });
      }
    };

    try {
      for (let b = 0; b < batches; b += 1) {
        const slice = files.slice(
          b * FILES_PER_REQUEST,
          (b + 1) * FILES_PER_REQUEST,
        );
        setUploadBatch({ current: b + 1, total: batches });

        const fd = new FormData();
        fd.append("kind", kind);
        for (const f of slice) {
          fd.append("file", f);
        }

        let res;
        try {
          res = await fetch("/api/admin/upload", {
            method: "POST",
            body: fd,
          });
        } catch {
          failSlice(slice, "Erreur réseau.");
          continue;
        }

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 504 || res.status === 502) {
            failSlice(
              slice,
              "Délai serveur dépassé — le lot est envoyé par petits groupes ; réessaie ce groupe.",
            );
          } else if (res.status === 413) {
            failSlice(slice, "Requête trop volumineuse (fichiers trop lourds).");
          } else if (Array.isArray(data.failed) && data.failed.length) {
            totalFailed.push(...data.failed);
          } else {
            const msg =
              data.error ||
              (res.status === 401
                ? "Session expirée — reconnecte-toi."
                : `Erreur serveur (${res.status}).`);
            failSlice(slice, msg);
          }
          continue;
        }

        totalProjects.push(...(data.projects ?? []));
        totalFailed.push(...(data.failed ?? []));
      }

      const n = totalProjects.length;
      const failed = totalFailed;

      if (n === 0) {
        setMessageKind("err");
        setMessage(
          failed.length
            ? `Aucun fichier enregistré. ${failed.map((f) => `${f.name}: ${f.error}`).join(" · ")}`
            : "Échec de l’upload.",
        );
      } else if (failed.length === 0) {
        setMessageKind("ok");
        setMessage(
          n <= 1
            ? "Image enregistrée — elle apparaît sur la page publique."
            : `${n} images enregistrées — elles apparaissent sur la page publique.`,
        );
        setFiles([]);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setMessageKind("ok");
        setMessage(
          `${n} image(s) enregistrée(s). Échecs : ${failed
            .map((f) => `${f.name} (${f.error})`)
            .join(" · ")}`,
        );
        setFiles([]);
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch {
      setMessageKind("err");
      setMessage("Erreur réseau.");
    } finally {
      setUploadBatch(null);
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
        JPEG, PNG, GIF ou Webp — max. 12&nbsp;Mo par fichier, jusqu’à 40 fichiers.
        Envoi automatique par petits lots pour éviter les timeouts. Fichiers sur{" "}
        <strong>Vercel Blob</strong>, métadonnées dans{" "}
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
            ? uploadBatch
              ? `Envoi lot ${uploadBatch.current}/${uploadBatch.total}…`
              : "Envoi en cours…"
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
