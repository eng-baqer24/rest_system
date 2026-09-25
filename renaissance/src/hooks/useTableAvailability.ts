"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface SupabaseReservationRow {
  id?: string;
  date?: string;
  time?: string;
  status?: string;
  notes?: string | null;
  table_number?: string | null;
}

function extractTableFromNotes(notes?: string | null): string | null {
  if (!notes) return null;
  const match = notes.match(/\[(?:الطاولة|Table|table_number):\s*([A-Za-z0-9_-]+)\]/i);
  return match ? match[1].trim() : null;
}

export function useTableAvailability(date?: string, time?: string) {
  const [bookedTables, setBookedTables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!date || !time) {
      setBookedTables([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const bookedSet = new Set<string>();

    try {
      // 1. Primary Query: Supabase Direct Query as requested
      try {
        const { data: supaData, error: supaErr } = await supabase
          .from("Reservation")
          .select("id, date, time, status, notes")
          .eq("date", date)
          .eq("time", time)
          .neq("status", "cancelled");

        if (!supaErr && Array.isArray(supaData)) {
          for (const row of (supaData as SupabaseReservationRow[])) {
            const tableNum = row.table_number || extractTableFromNotes(row.notes);
            if (tableNum) bookedSet.add(tableNum);
          }
        }
      } catch (err) {
        console.warn("Direct Supabase query warning, falling back to API:", err);
      }

      // 2. Secondary Query: Internal Backend API Endpoint (syncs Supabase, DB, memory store)
      try {
        const res = await fetch(
          `/api/reservations/booked-tables?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.bookedTables)) {
            for (const tableId of data.bookedTables) {
              bookedSet.add(tableId);
            }
          }
        }
      } catch (apiErr) {
        console.warn("API booked-tables fetch warning:", apiErr);
      }

      setBookedTables(Array.from(bookedSet));
    } catch (err) {
      console.error("Error fetching table availability:", err);
      setError("فشل فحص توافر الطاولات");
    } finally {
      setIsLoading(false);
    }
  }, [date, time]);

  useEffect(() => {
    let isMounted = true;

    const execute = async () => {
      if (!date || !time) {
        if (isMounted) {
          setBookedTables([]);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      const bookedSet = new Set<string>();

      try {
        try {
          const { data: supaData, error: supaErr } = await supabase
            .from("Reservation")
            .select("id, date, time, status, notes")
            .eq("date", date)
            .eq("time", time)
            .neq("status", "cancelled");

          if (!supaErr && Array.isArray(supaData)) {
            for (const row of (supaData as SupabaseReservationRow[])) {
              const tableNum = row.table_number || extractTableFromNotes(row.notes);
              if (tableNum) bookedSet.add(tableNum);
            }
          }
        } catch {
          // Handled silently
        }

        try {
          const res = await fetch(
            `/api/reservations/booked-tables?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
            { cache: "no-store" }
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.bookedTables)) {
              for (const tableId of data.bookedTables) {
                bookedSet.add(tableId);
              }
            }
          }
        } catch {
          // Handled silently
        }

        if (isMounted) {
          setBookedTables(Array.from(bookedSet));
        }
      } catch {
        if (isMounted) {
          setError("فشل فحص توافر الطاولات");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, [date, time]);

  return {
    bookedTables,
    isLoading,
    error,
    refetch: fetchAvailability,
  };
}
