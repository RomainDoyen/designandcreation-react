import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { deleteBlobFromImageUrl } from "@/lib/blobDelete";
import { prisma } from "@/lib/prisma";
import { uploadPortfolioImage } from "@/lib/portfolioUpload";
import { sessionOptions } from "@/lib/session";
import { sanitizeFilename } from "@/lib/filename";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const MAX_BYTES = 12 * 1024 * 1024;

async function requireAdmin() {
  const session = await getIronSession(await cookies(), sessionOptions);
  if (!session.admin) return null;
  return session;
}

export async function PATCH(request, context) {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return Response.json({ error: "Identifiant manquant." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  const sortOrder = body?.sortOrder;
  if (typeof sortOrder !== "number" || !Number.isInteger(sortOrder)) {
    return Response.json({ error: "sortOrder entier requis." }, { status: 400 });
  }

  try {
    const updated = await prisma.project.update({
      where: { id },
      data: { sortOrder },
      select: { id: true, kind: true, imageUrl: true, sortOrder: true },
    });
    return Response.json({ ok: true, project: updated });
  } catch (e) {
    if (e?.code === "P2025") {
      return Response.json({ error: "Projet introuvable." }, { status: 404 });
    }
    console.error(e);
    return Response.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}

export async function PUT(request, context) {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return Response.json({ error: "Identifiant manquant." }, { status: 400 });
  }

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "Projet introuvable." }, { status: 404 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string" || !file.name) {
    return Response.json({ error: "Fichier manquant." }, { status: 400 });
  }

  const contentType = file.type || "application/octet-stream";
  if (!ALLOWED_TYPES.has(contentType)) {
    return Response.json({ error: "Type de fichier non autorisé." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0 || buf.length > MAX_BYTES) {
    return Response.json({ error: "Fichier trop volumineux ou vide." }, { status: 400 });
  }

  const safe = sanitizeFilename(file.name);
  const pathname = `${existing.kind}/${randomUUID()}-${safe}`;

  let imageUrl;
  try {
    imageUrl = await uploadPortfolioImage({
      pathname,
      buffer: buf,
      contentType,
    });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Échec du stockage (Blob)." },
      { status: 500 },
    );
  }

  const previousUrl = existing.imageUrl;

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { imageUrl },
      select: { id: true, imageUrl: true, sortOrder: true, kind: true },
    });

    await deleteBlobFromImageUrl(previousUrl);

    return Response.json({ ok: true, project });
  } catch (e) {
    console.error(e);
    try {
      await deleteBlobFromImageUrl(imageUrl);
    } catch {
      /* ignore rollback blob */
    }
    return Response.json({ error: "Mise à jour base impossible." }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return Response.json({ error: "Identifiant manquant." }, { status: 400 });
  }

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "Projet introuvable." }, { status: 404 });
  }

  try {
    await prisma.project.delete({ where: { id } });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Suppression base impossible." }, { status: 500 });
  }

  await deleteBlobFromImageUrl(existing.imageUrl);

  return Response.json({ ok: true });
}
