import { getAdminUser, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Reservations fetch error:", error);
    return NextResponse.json(
      { error: "تعذّر تحميل الحجوزات." },
      { status: 500 }
    );
  }
}
