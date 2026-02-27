import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, guests, name, email, phone, notes } = body;

    if (!date || !time || guests == null) {
      return NextResponse.json(
        { error: "Date, time and number of guests are required" },
        { status: 400 }
      );
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
        status: "pending",
      },
    });

    return NextResponse.json({
      id: reservation.id,
      message: "Reservation request received successfully",
    });
  } catch (e) {
    console.error("Reservation API error:", e);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
