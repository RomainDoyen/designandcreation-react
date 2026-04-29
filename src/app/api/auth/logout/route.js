import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

export async function POST() {
  const session = await getIronSession(await cookies(), sessionOptions);
  session.destroy();
  await session.save();
  return Response.json({ ok: true });
}
