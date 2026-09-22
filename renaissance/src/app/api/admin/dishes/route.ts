import { getAdminUser, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureMenuSeeded, serializeDish } from "@/lib/menu-sync";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    await ensureMenuSeeded();
    const data = await prisma.dish.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { nameAr: "asc" }],
    });
    return NextResponse.json({ dishes: data.map(serializeDish) });
  } catch (error) {
    console.error("Dishes fetch error:", error);
    return NextResponse.json(
      { error: "تعذّر تحميل الأطباق." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  const body = await request.json();
  const { name, description, price, categoryId, imageUrl } = body;

  if (!name?.trim() || !categoryId) {
    return NextResponse.json(
      { error: "اسم الطبق والقسم مطلوبان." },
      { status: 400 }
    );
  }

  try {
    const dish = await prisma.dish.create({
      data: {
        nameAr: name.trim(),
        description: description?.trim() || null,
        price: price != null && price !== "" ? Number(price) : null,
        categoryId,
        imageUrl: imageUrl?.trim() || null,
        sortOrder: 0,
      },
      include: { category: true },
    });

    return NextResponse.json({ dish: serializeDish(dish) }, { status: 201 });
  } catch (error) {
    console.error("Dish create error:", error);
    return NextResponse.json(
      { error: "تعذّر إضافة الطبق." },
      { status: 500 }
    );
  }
}
