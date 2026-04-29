import { get } from "@vercel/blob";
import { getBlobAccessMode } from "@/lib/portfolioUpload";

export const runtime = "nodejs";

const PATH_RE = /^(draw|logo)\/[a-zA-Z0-9._-]+$/;

function decodePathname(token) {
  try {
    const pathname = Buffer.from(token, "base64url").toString("utf8").trim();
    if (!PATH_RE.test(pathname)) return null;
    return pathname;
  } catch {
    return null;
  }
}

/**
 * Sert une image Blob (store private) avec le token serveur.
 * Les URLs en base sont du type /api/blob-file/<base64url pathname>.
 */
export async function GET(_request, context) {
  const params = await context.params;
  const token = params?.token;
  if (!token || typeof token !== "string") {
    return new Response(null, { status: 404 });
  }

  const pathname = decodePathname(token);
  if (!pathname) {
    return new Response(null, { status: 404 });
  }

  const rw = process.env.BLOB_READ_WRITE_TOKEN;
  if (!rw?.trim()) {
    return new Response(null, { status: 503 });
  }

  const access = getBlobAccessMode();
  const result = await get(pathname, {
    access,
    token: rw,
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return new Response(null, { status: 404 });
  }

  return new Response(result.stream, {
    status: 200,
    headers: {
      "Content-Type": result.blob.contentType,
      "Cache-Control": "public, max-age=300, s-maxage=600",
    },
  });
}
