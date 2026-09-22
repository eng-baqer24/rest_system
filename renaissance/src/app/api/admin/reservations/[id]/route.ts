import { getAdminUser, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled"];

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();
  const { status } = body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "حالة الحجز غير صالحة." },
      { status: 400 }
    );
  }

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Reservation update error:", error);
    return NextResponse.json(
      { error: "تعذّر تحديث الحجز." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  const { id } = await context.params;
  try {
    await prisma.reservation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation delete error:", error);
    return NextResponse.json(
      { error: "تعذّر حذف الحجز." },
      { status: 500 }
    );
  }
}
