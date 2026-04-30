import { randomUUID } from "crypto";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sanitizeFilename } from "@/lib/filename";
import { prisma } from "@/lib/prisma";
import { uploadPortfolioImage } from "@/lib/portfolioUpload";
import { sessionOptions } from "@/lib/session";

const MAX_BYTES = 12 * 1024 * 1024;
const MAX_FILES = 40;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export const runtime = "nodejs";
/** Limite Vercel / Next — augmente le plafond sur les offres Pro (Hobby reste souvent ~10 s). */
export const maxDuration = 60;

function isFileField(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.name === "string" &&
    typeof value.arrayBuffer === "function"
  );
}

function validateBuffer(buf) {
  if (buf.length === 0) {
    return "Fichier vide.";
  }
  if (buf.length > MAX_BYTES) {
    return "Fichier trop volumineux (max. 12 Mo).";
  }
  return null;
}

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

  const files = formData.getAll("file").filter(isFileField);
  if (files.length === 0) {
    return Response.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return Response.json(
      { error: `Trop de fichiers en une fois (max. ${MAX_FILES}).` },
      { status: 400 },
    );
  }

  let sortBase;
  try {
    const agg = await prisma.project.aggregate({
      where: { kind },
      _max: { sortOrder: true },
    });
    sortBase = (agg._max.sortOrder ?? -1) + 1;
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Impossible de lire l’ordre des projets." },
      { status: 500 },
    );
  }

  const projects = [];
  const failed = [];
  let nextOrder = sortBase;

  for (const file of files) {
    const contentType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(contentType)) {
      failed.push({ name: file.name, error: "Type de fichier non autorisé." });
      continue;
    }

    let buf;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buf = Buffer.from(arrayBuffer);
    } catch {
      failed.push({ name: file.name, error: "Lecture du fichier impossible." });
      continue;
    }

    const sizeErr = validateBuffer(buf);
    if (sizeErr) {
      failed.push({ name: file.name, error: sizeErr });
      continue;
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
          : "Échec du stockage (Vercel Blob).";
      failed.push({ name: file.name, error: msg });
      continue;
    }

    try {
      const project = await prisma.project.create({
        data: {
          kind,
          imageUrl,
          sortOrder: nextOrder,
        },
        select: { id: true, imageUrl: true },
      });
      projects.push(project);
      nextOrder += 1;
    } catch (e) {
      console.error(e);
      failed.push({ name: file.name, error: "Échec enregistrement base de données." });
    }
  }

  if (projects.length === 0) {
    return Response.json(
      {
        error: "Aucun fichier n’a pu être enregistré.",
        failed,
      },
      { status: 400 },
    );
  }

  return Response.json({
    ok: true,
    projects,
    failed,
    // Rétrocompat : un seul fichier réussi
    ...(projects.length === 1 && failed.length === 0
      ? { project: projects[0] }
      : {}),
  });
}
