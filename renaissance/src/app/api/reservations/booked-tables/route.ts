import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const time = request.nextUrl.searchParams.get("time");

  if (!date || !time) {
    return NextResponse.json({ tableIds: [] });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        date: new Date(date),
        time,
        status: { not: "cancelled" },
        tableId: { not: null },
      },
      select: { tableId: true },
    });

    return NextResponse.json({
      tableIds: reservations
        .map((r) => r.tableId)
        .filter((id): id is string => Boolean(id)),
    });
  } catch {
    return NextResponse.json({ tableIds: [] });
  }
}
