import { prisma } from "@/lib/prisma";
import { ensureMenuSeeded, staticMenuPayload } from "@/lib/menu-sync";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureMenuSeeded();
    const categories = await prisma.dishCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: { orderBy: { sortOrder: "asc" } },
      },
    });

    const payload = categories
      .filter((cat) => cat.items.length > 0)
      .map((cat) => ({
        id: cat.id,
        name: cat.nameAr,
        items: cat.items.map((item) => ({
          name: item.nameAr,
          description: item.description ?? "",
          image: item.imageUrl ?? "",
          price: item.price != null ? String(Number(item.price)) : "",
        })),
      }));

    if (payload.length === 0) {
      return NextResponse.json({ categories: staticMenuPayload() });
    }

    return NextResponse.json({ categories: payload });
  } catch (error) {
    console.error("Public menu fallback:", error);
    return NextResponse.json({ categories: staticMenuPayload() });
  }
}
