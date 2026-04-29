import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import {
  getAdminPasswordHashFromEnv,
  hasLegacyAdminPasswordHashEnv,
} from "@/lib/adminPasswordHash";
import { sessionOptions } from "@/lib/session";

export async function POST(request) {
  if (
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.length < 32
  ) {
    return Response.json(
      { error: "Configuration serveur incomplète." },
      { status: 500 },
    );
  }

  const hash = getAdminPasswordHashFromEnv();
  if (!hash) {
    const legacy = hasLegacyAdminPasswordHashEnv();
    return Response.json(
      {
        error: legacy
          ? "Le hash admin est invalide (souvent les caractères $ sont mangés par Next.js). Utilise ADMIN_PASSWORD_HASH_B64 : relance npm run hash-admin-password et copie la ligne indiquée."
          : "Configuration serveur incomplète. Définis ADMIN_PASSWORD_HASH_B64 (voir npm run hash-admin-password).",
      },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Corps invalide." }, { status: 400 });
  }

  const password = body?.password;
  if (!password || typeof password !== "string") {
    return Response.json({ error: "Mot de passe requis." }, { status: 400 });
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return Response.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const session = await getIronSession(await cookies(), sessionOptions);
  session.admin = true;
  await session.save();

  return Response.json({ ok: true });
}
