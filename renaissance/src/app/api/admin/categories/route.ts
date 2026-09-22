import { getAdminUser, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureMenuSeeded } from "@/lib/menu-sync";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    await ensureMenuSeeded();
    const categories = await prisma.dishCategory.findMany({
      select: { id: true, nameAr: true, nameEn: true, sortOrder: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "تعذّر تحميل الأقسام." },
      { status: 500 }
    );
  }
}
