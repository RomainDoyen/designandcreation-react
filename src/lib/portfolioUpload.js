import { put } from "@vercel/blob";

/**
 * `public` = URL Vercel directe dans la base (store Blob « public » côté Vercel).
 * `private` = URL interne `/api/blob-file/...` (store « private » — défaut).
 *
 * @see https://vercel.com/docs/storage/vercel-blob
 */
export function getBlobAccessMode() {
  return process.env.BLOB_ACCESS === "public" ? "public" : "private";
}

/**
 * Neon = métadonnées ; fichiers = Vercel Blob.
 * En mode private, on enregistre une URL vers notre proxy (token = pathname encodé).
 */
export async function uploadPortfolioImage({ pathname, buffer, contentType }) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token?.trim()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN manquant. Crée un store Blob dans le dashboard Vercel (Storage) et copie le token en .env.local.",
    );
  }

  const access = getBlobAccessMode();

  const blob = await put(pathname, buffer, {
    access,
    contentType: contentType || "application/octet-stream",
    token,
  });

  if (access === "public") {
    return blob.url;
  }

  const key = Buffer.from(blob.pathname, "utf8").toString("base64url");
  return `/api/blob-file/${key}`;
}
