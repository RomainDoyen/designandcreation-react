import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const kind = request.nextUrl.searchParams.get("kind");
  if (kind !== "draw" && kind !== "logo") {
    return Response.json({ error: "Paramètre kind invalide." }, { status: 400 });
  }

  try {
    const items = await prisma.project.findMany({
      where: { kind },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: { id: true, imageUrl: true, sortOrder: true, createdAt: true },
    });
    return Response.json({ items });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Erreur base de données." },
      { status: 500 },
    );
  }
}
