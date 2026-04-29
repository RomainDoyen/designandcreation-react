import { randomUUID } from "crypto";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sanitizeFilename } from "@/lib/filename";
import { prisma } from "@/lib/prisma";
import { uploadPortfolioImage } from "@/lib/portfolioUpload";
import { sessionOptions } from "@/lib/session";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export const runtime = "nodejs";

export async function POST(request) {
  const session = await getIronSession(await cookies(), sessionOptions);
  if (!session.admin) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  const kind = formData.get("kind");
  if (kind !== "draw" && kind !== "logo") {
    return Response.json({ error: "Type de projet invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string" || !file.name) {
    return Response.json({ error: "Fichier manquant." }, { status: 400 });
  }

  const contentType = file.type || "application/octet-stream";
  if (!ALLOWED_TYPES.has(contentType)) {
    return Response.json({ error: "Type de fichier non autorisé." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);
  if (buf.length === 0 || buf.length > MAX_BYTES) {
    return Response.json({ error: "Fichier trop volumineux ou vide." }, { status: 400 });
  }

  const safe = sanitizeFilename(file.name);
  const pathname = `${kind}/${randomUUID()}-${safe}`;

  let imageUrl;
  try {
    imageUrl = await uploadPortfolioImage({
      pathname,
      buffer: buf,
      contentType,
    });
  } catch (e) {
    console.error(e);
    const msg =
      e instanceof Error && e.message.includes("BLOB_READ_WRITE_TOKEN")
        ? e.message
        : "Échec du stockage (Vercel Blob). Vérifie BLOB_READ_WRITE_TOKEN et le store dans le projet Vercel.";
    return Response.json({ error: msg }, { status: 500 });
  }

  try {
    const agg = await prisma.project.aggregate({
      where: { kind },
      _max: { sortOrder: true },
    });
    const sortOrder = (agg._max.sortOrder ?? -1) + 1;

    const project = await prisma.project.create({
      data: {
        kind,
        imageUrl,
        sortOrder,
      },
      select: { id: true, imageUrl: true },
    });

    return Response.json({ ok: true, project });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Échec enregistrement base de données." },
      { status: 500 },
    );
  }
}
