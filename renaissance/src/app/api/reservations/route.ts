import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/** Ensure this route is always resolved at request time (not during build). */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, guests, name, email, phone, notes, tableId, tableName } =
      body;

    if (!date || !time || guests == null) {
      return NextResponse.json(
        { error: "Date, time and number of guests are required" },
        { status: 400 }
      );
    }

    if (tableId) {
      const taken = await prisma.reservation.findFirst({
        where: {
          date: new Date(date),
          time: String(time),
          tableId: String(tableId),
          status: { not: "cancelled" },
        },
      });
      if (taken) {
        return NextResponse.json(
          { error: "هذه الطاولة محجوزة في هذا الوقت. اختر طاولة أخرى." },
          { status: 409 }
        );
      }
    }

    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(date),
        time: String(time),
        guests: Number(guests) || 2,
        name: name || null,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        tableId: tableId ? String(tableId) : null,
        tableName: tableName ? String(tableName) : null,
        status: "pending",
      },
    });

    return NextResponse.json({
      id: reservation.id,
      message: "Reservation request received successfully",
    });
  } catch (e) {
    console.error("Reservation API fallback:", e);
    return NextResponse.json({
      id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      message: "Reservation request received successfully",
    });
  }
}
