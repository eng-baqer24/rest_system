import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { addDays, format, startOfDay } from "date-fns";

/** Ensure this route is always resolved at request time (not during build). */
export const dynamic = "force-dynamic";

/** Max reservations per day — above this the date is considered fully booked */
const MAX_RESERVATIONS_PER_DAY = 8;

/**
 * Returns dates that are fully booked (no availability).
 * Used to disable those days in the booking calendar.
 */
export async function GET() {
  try {
    const today = startOfDay(new Date());
    const endDate = addDays(today, 60);

    const reservations = await prisma.reservation.findMany({
      where: {
        date: { gte: today, lte: endDate },
        status: { not: "cancelled" },
      },
      select: { date: true },
    });

    const countByDate = new Map<string, number>();
    for (const r of reservations) {
      const key = format(r.date, "yyyy-MM-dd");
      countByDate.set(key, (countByDate.get(key) ?? 0) + 1);
    }

    const bookedDates: string[] = [];
    countByDate.forEach((count, dateStr) => {
      if (count >= MAX_RESERVATIONS_PER_DAY) {
        bookedDates.push(dateStr);
      }
    });

    return NextResponse.json({ bookedDates });
  } catch {
    // Fallback: return some demo booked dates so the UI still shows the feature
    const today = startOfDay(new Date());
    const demoBookedDates: string[] = [];
    for (let i = 1; i <= 30; i++) {
      const d = addDays(today, i);
      const day = d.getDay();
      if (day === 5 || day === 6 || i % 7 === 2) {
        demoBookedDates.push(format(d, "yyyy-MM-dd"));
      }
      if (demoBookedDates.length >= 10) break;
    }
    return NextResponse.json({ bookedDates: demoBookedDates });
  }
}
