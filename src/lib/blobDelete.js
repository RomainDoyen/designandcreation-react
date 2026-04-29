import { del } from "@vercel/blob";

/**
 * Supprime le fichier Blob associé à une entrée `Project.imageUrl`.
 * Ne lève pas si l’objet est déjà absent (nettoyage best-effort).
 */
export async function deleteBlobFromImageUrl(imageUrl) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token || !imageUrl) return;

  try {
    if (imageUrl.startsWith("/api/blob-file/")) {
      const key = imageUrl.slice("/api/blob-file/".length);
      const pathname = Buffer.from(key, "base64url").toString("utf8");
      await del(pathname, { token });
    } else if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      await del(imageUrl, { token });
    }
  } catch (e) {
    console.warn("deleteBlobFromImageUrl:", e?.message || e);
  }
}
