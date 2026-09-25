import { isDatabaseReady, prisma, recordDatabaseError } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface ReservationData {
  id: string;
  date: string;
  time: string;
  guests: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  table_number?: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt?: string;
}

declare global {
  var __renaissance_reservations: ReservationData[] | undefined;
}

function getInitialReservations(): ReservationData[] {
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split("T")[0];

  return [
    {
      id: "RN-882140",
      date: todayStr,
      time: "20:00",
      guests: 4,
      table_number: "T-03",
      name: "د. طارق السعدون",
      email: "tariq.saadoon@example.com",
      phone: "+9647701239876",
      notes: "طاولة خاصة ومطلة على الحديقة، احتفال بذكرى سنوية",
      status: "confirmed",
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: "RN-771924",
      date: todayStr,
      time: "20:00",
      guests: 2,
      table_number: "T-01",
      name: "المهندسة ريم الحسيني",
      email: "reem.alhusseini@example.com",
      phone: "+9647805544332",
      notes: "يرجى تجهيز باقة زهور خفيفة على الطاولة",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    },
    {
      id: "RN-654321",
      date: todayStr,
      time: "19:00",
      guests: 6,
      table_number: "T-06",
      name: "أحمد كمال الجبوري",
      email: "ahmed.kamal@example.com",
      phone: "+9647712345678",
      notes: "عشاء عمل رسمي - يفضل منطقة هادئة",
      status: "confirmed",
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: "RN-549012",
      date: tomorrowStr,
      time: "20:30",
      guests: 2,
      table_number: "T-02",
      name: "سارة عبد الرحمن",
      email: "sara.rahman@example.com",
      phone: "+9647901122334",
      notes: "طاولة في الصالة الرئيسية، شخص نباتي",
      status: "confirmed",
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
    {
      id: "RN-432109",
      date: dayAfterStr,
      time: "19:30",
      guests: 3,
      table_number: "T-09",
      name: "يوسف القيسي",
      email: "youssef.qaisi@example.com",
      phone: "+9647709988776",
      notes: "عيد ميلاد عائلي",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    },
    {
      id: "RN-321098",
      date: todayStr,
      time: "18:00",
      guests: 2,
      table_number: "T-08",
      name: "ليلى حسن",
      email: "layla.hassan@example.com",
      phone: "+9647809911223",
      notes: "حجز سابق تم إكماله بنجاح",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    },
  ];
}

if (!globalThis.__renaissance_reservations) {
  globalThis.__renaissance_reservations = getInitialReservations();
}

const memoryStore = globalThis.__renaissance_reservations;

// Helper to extract table number from notes if stored as [الطاولة: T-01] or [Table: T-01]
function extractTableFromNotes(notes?: string | null): string | null {
  if (!notes) return null;
  const match = notes.match(/\[(?:الطاولة|Table|table_number):\s*([A-Za-z0-9_-]+)\]/i);
  return match ? match[1].trim() : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q")?.toLowerCase();
    const dateParam = searchParams.get("date");
    const timeParam = searchParams.get("time");

    let reservations: ReservationData[] = [];

    // 1. Try Prisma if available
    if (isDatabaseReady()) {
      try {
        const dbReservations = await prisma.reservation.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
        });

        if (dbReservations && dbReservations.length > 0) {
          reservations = dbReservations.map((r) => ({
            id: r.id,
            date: r.date.toISOString().split("T")[0],
            time: r.time,
            guests: r.guests,
            name: r.name,
            email: r.email,
            phone: r.phone,
            notes: r.notes,
            table_number: r.tableNumber || extractTableFromNotes(r.notes),
            status: (r.status as ReservationData["status"]) || "pending",
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }));
        } else {
          reservations = [...memoryStore];
        }
      } catch (err) {
        recordDatabaseError(err);
        reservations = [...memoryStore];
      }
    } else {
      reservations = [...memoryStore];
    }

    // 2. Also query Supabase directly to include any records created directly in Supabase
    try {
      let supaQuery = supabase
        .from("Reservation")
        .select("*")
        .neq("status", "cancelled");

      if (dateParam) {
        supaQuery = supaQuery.eq("date", dateParam);
      }
      if (timeParam) {
        supaQuery = supaQuery.eq("time", timeParam);
      }

      const { data: supaData } = await supaQuery.limit(50);
      if (supaData && supaData.length > 0) {
        for (const item of supaData) {
          const itemDate = typeof item.date === "string" ? item.date.split("T")[0] : "";
          const found = reservations.find((r) => r.id === item.id);
          const tableNum = (item as any).table_number || extractTableFromNotes(item.notes);

          if (!found) {
            reservations.push({
              id: item.id || `RN-${Math.floor(100000 + Math.random() * 900000)}`,
              date: itemDate,
              time: item.time || "",
              guests: item.guests || 2,
              name: item.name || null,
              email: item.email || null,
              phone: item.phone || null,
              notes: item.notes || null,
              table_number: tableNum,
              status: (item.status as ReservationData["status"]) || "confirmed",
              createdAt: item.createdAt || new Date().toISOString(),
            });
          } else if (tableNum && !found.table_number) {
            found.table_number = tableNum;
          }
        }
      }
    } catch {
      // Supabase query fallback gracefully handled
    }

    // Filter by date if specified
    if (dateParam) {
      reservations = reservations.filter((r) => r.date === dateParam);
    }

    // Filter by time if specified
    if (timeParam) {
      reservations = reservations.filter((r) => r.time === timeParam);
    }

    // Filter by status if specified
    if (status && status !== "all") {
      reservations = reservations.filter((r) => r.status === status);
    }

    // Filter by search query if provided
    if (query) {
      reservations = reservations.filter((r) => {
        return (
          r.name?.toLowerCase().includes(query) ||
          r.phone?.toLowerCase().includes(query) ||
          r.id?.toLowerCase().includes(query) ||
          r.email?.toLowerCase().includes(query) ||
          r.notes?.toLowerCase().includes(query) ||
          r.table_number?.toLowerCase().includes(query)
        );
      });
    }

    // Collect all booked table numbers for the requested time slot (non-cancelled)
    const bookedTables = Array.from(
      new Set(
        reservations
          .filter((r) => r.status !== "cancelled" && !!r.table_number)
          .map((r) => r.table_number as string)
      )
    );

    return NextResponse.json({
      reservations,
      bookedTables,
      stats: {
        total: memoryStore.length,
        pending: memoryStore.filter((r) => r.status === "pending").length,
        confirmed: memoryStore.filter((r) => r.status === "confirmed").length,
        completed: memoryStore.filter((r) => r.status === "completed").length,
        cancelled: memoryStore.filter((r) => r.status === "cancelled").length,
      },
    });
  } catch (error) {
    console.error("GET reservations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations", reservations: memoryStore, bookedTables: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, guests, name, email, phone, notes, status, table_number, tableNumber } = body;

    const selectedTable = table_number || tableNumber || null;

    if (!date || !time || guests == null) {
      return NextResponse.json(
        { error: "Date, time, and guests count are required" },
        { status: 400 }
      );
    }

    const settings = globalThis.__renaissance_settings;
    if (settings && settings.isAcceptingBookings === false && status !== "confirmed") {
      return NextResponse.json(
        {
          error:
            "عذراً، استقبال الحجوزات عبر الموقع متوقف مؤقتاً. يُرجى التواصل معنا هاتفياً للحجز المباشر.",
        },
        { status: 403 }
      );
    }

    const parsedDate = typeof date === "string" ? date.split("T")[0] : new Date(date).toISOString().split("T")[0];

    // Check if table is already booked for this date and time
    if (selectedTable) {
      const existingConflict = memoryStore.find(
        (r) =>
          r.date === parsedDate &&
          r.time === String(time) &&
          r.table_number === selectedTable &&
          r.status !== "cancelled"
      );

      if (existingConflict) {
        return NextResponse.json(
          {
            error: `الطاولة ${selectedTable} محجوزة مسبقاً في هذا الوقت. يُرجى اختيار طاولة أخرى متاحة.`,
          },
          { status: 409 }
        );
      }
    }

    const reservationId = `RN-${Math.floor(100000 + Math.random() * 900000)}`;
    const initialStatus: ReservationData["status"] =
      status || (settings?.autoConfirm ? "confirmed" : "pending");

    // Format notes with table number badge tag so table assignment is always permanent
    const formattedNotes = selectedTable
      ? `[الطاولة: ${selectedTable}] ${notes?.trim() || ""}`.trim()
      : notes?.trim() || null;

    const newRecord: ReservationData = {
      id: reservationId,
      date: parsedDate,
      time: String(time),
      guests: Number(guests) || 2,
      name: name?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      notes: formattedNotes,
      table_number: selectedTable,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.unshift(newRecord);

    // 1. Attempt to persist into Supabase
    try {
      const supaPayload: Record<string, any> = {
        id: reservationId,
        date: parsedDate,
        time: String(time),
        guests: Number(guests) || 2,
        name: name?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        notes: formattedNotes,
        status: initialStatus,
      };

      if (selectedTable) {
        supaPayload.table_number = selectedTable;
      }

      const { error: supaErr } = await supabase.from("Reservation").insert(supaPayload);
      if (supaErr) {
        // If column 'table_number' does not exist in Supabase schema cache, retry without it (table is saved in notes)
        if (supaErr.code === "PGRST204" || supaErr.message?.includes("table_number")) {
          delete supaPayload.table_number;
          await supabase.from("Reservation").insert(supaPayload);
        }
      }
    } catch {
      // Handled silently
    }

    // 2. Attempt to persist in Prisma if database is connected
    if (isDatabaseReady()) {
      try {
        const created = await prisma.reservation.create({
          data: {
            date: new Date(parsedDate),
            time: String(time),
            guests: Number(guests) || 2,
            name: name || null,
            email: email || null,
            phone: phone || null,
            notes: formattedNotes,
            tableNumber: selectedTable,
            status: initialStatus,
          },
        });
        newRecord.id = created.id;
      } catch (err) {
        recordDatabaseError(err);
      }
    }

    return NextResponse.json({
      success: true,
      id: newRecord.id,
      reservation: newRecord,
      message: "تم حفظ الحجز وتأكيد الطاولة بنجاح",
    });
  } catch (error) {
    console.error("POST reservations error:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes, guests, time, date, table_number } = body;

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    let updatedItem: ReservationData | null = null;
    const index = memoryStore.findIndex((r) => r.id === id);

    if (index !== -1) {
      if (status) memoryStore[index].status = status;
      if (notes !== undefined) memoryStore[index].notes = notes;
      if (guests !== undefined) memoryStore[index].guests = Number(guests);
      if (time !== undefined) memoryStore[index].time = String(time);
      if (date !== undefined) memoryStore[index].date = String(date);
      if (table_number !== undefined) memoryStore[index].table_number = table_number;
      memoryStore[index].updatedAt = new Date().toISOString();
      updatedItem = memoryStore[index];
    }

    if (isDatabaseReady()) {
      try {
        const dbUpdateData: Record<string, unknown> = {};
        if (status) dbUpdateData.status = status;
        if (notes !== undefined) dbUpdateData.notes = notes;
        if (guests !== undefined) dbUpdateData.guests = Number(guests);
        if (time !== undefined) dbUpdateData.time = String(time);
        if (date !== undefined) dbUpdateData.date = new Date(date);
        if (table_number !== undefined) dbUpdateData.tableNumber = table_number;

        await prisma.reservation.update({
          where: { id },
          data: dbUpdateData,
        });
      } catch (dbErr) {
        recordDatabaseError(dbErr);
      }
    }

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Reservation not found in active list" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: status === "confirmed" ? "تمت الموافقة على الحجز بنجاح" : "تم تحديث الحجز بنجاح",
      reservation: updatedItem,
    });
  } catch (error) {
    console.error("PATCH reservations error:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const index = memoryStore.findIndex((r) => r.id === id);
    if (index !== -1) {
      memoryStore.splice(index, 1);
    }

    if (isDatabaseReady()) {
      try {
        await prisma.reservation.delete({ where: { id } });
      } catch (err) {
        recordDatabaseError(err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الحجز بنجاح",
      deletedId: id,
    });
  } catch (error) {
    console.error("DELETE reservations error:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
