import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { addDays, format, startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

const MAX_RESERVATIONS_PER_DAY = 8;

export async function GET() {
  try {
    const today = startOfDay(new Date());
    const endDate = addDays(today, 60);

    const reservationsPromise = prisma.reservation.findMany({
      where: {
        date: { gte: today, lte: endDate },
        status: { not: "cancelled" },
      },
      select: { date: true },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB Timeout")), 3500)
    );

    const reservations = await Promise.race([reservationsPromise, timeoutPromise]);

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

    return NextResponse.json(
      { bookedDates },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch {
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
