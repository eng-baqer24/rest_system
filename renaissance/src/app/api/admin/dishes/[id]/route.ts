import { getAdminUser, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeDish } from "@/lib/menu-sync";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();
  const { name, description, price, categoryId, imageUrl } = body;

  const data: Prisma.DishUpdateInput = {};
  if (name !== undefined) data.nameAr = name.trim();
  if (description !== undefined) data.description = description?.trim() || null;
  if (price !== undefined) {
    data.price = price != null && price !== "" ? Number(price) : null;
  }
  if (categoryId !== undefined) {
    data.category = { connect: { id: categoryId } };
  }
  if (imageUrl !== undefined) data.imageUrl = imageUrl?.trim() || null;

  try {
    const dish = await prisma.dish.update({
      where: { id },
      data,
      include: { category: true },
    });
    return NextResponse.json({ dish: serializeDish(dish) });
  } catch (error) {
    console.error("Dish update error:", error);
    return NextResponse.json(
      { error: "تعذّر تحديث الطبق." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  const { id } = await context.params;
  try {
    await prisma.dish.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dish delete error:", error);
    return NextResponse.json(
      { error: "تعذّر حذف الطبق." },
      { status: 500 }
    );
  }
}
