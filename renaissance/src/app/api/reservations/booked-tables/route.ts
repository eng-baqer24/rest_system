import { isDatabaseReady, prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractTableFromNotes(notes?: string | null): string | null {
  if (!notes) return null;
  const match = notes.match(/\[(?:الطاولة|Table|table_number):\s*([A-Za-z0-9_-]+)\]/i);
  return match ? match[1].trim() : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!date) {
      return NextResponse.json({ bookedTables: [] });
    }

    const booked = new Set<string>();

    // 1. Check in-memory store
    const memory = globalThis.__renaissance_reservations || [];
    for (const r of memory) {
      if (r.date === date && (!time || r.time === time) && r.status !== "cancelled") {
        if (r.table_number) booked.add(r.table_number);
        const fromNote = extractTableFromNotes(r.notes);
        if (fromNote) booked.add(fromNote);
      }
    }

    // 2. Check Supabase
    try {
      let query = supabase
        .from("Reservation")
        .select("id, date, time, notes, status")
        .eq("date", date)
        .neq("status", "cancelled");

      if (time) {
        query = query.eq("time", time);
      }

      const { data, error } = await query;
      if (!error && data) {
        for (const row of data) {
          const tableNum = (row as any).table_number || extractTableFromNotes(row.notes);
          if (tableNum) booked.add(tableNum);
        }
      }
    } catch {
      // Graceful fallback
    }

    // 3. Check Prisma if active
    if (isDatabaseReady()) {
      try {
        const whereClause: Record<string, any> = {
          date: new Date(date),
          status: { not: "cancelled" },
        };
        if (time) whereClause.time = time;

        const prismaResults = await prisma.reservation.findMany({
          where: whereClause,
          select: { tableNumber: true, notes: true },
        });

        for (const r of prismaResults) {
          if (r.tableNumber) booked.add(r.tableNumber);
          const fromNote = extractTableFromNotes(r.notes);
          if (fromNote) booked.add(fromNote);
        }
      } catch {
        // Graceful fallback
      }
    }

    return NextResponse.json({
      date,
      time: time || null,
      bookedTables: Array.from(booked),
    });
  } catch (error) {
    console.error("GET booked-tables error:", error);
    return NextResponse.json({ bookedTables: [] }, { status: 500 });
  }
}
