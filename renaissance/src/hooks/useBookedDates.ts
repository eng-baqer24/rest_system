"use client";

import { useEffect, useState } from "react";

/**
 * Fetches dates that are fully booked (no availability) and returns them as a Set for quick lookup.
 */
export function useBookedDates(): Set<string> {
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/reservations/booked-dates")
      .then((res) => res.json())
      .then((data: { bookedDates?: string[] }) => {
        setBookedDates(new Set(data.bookedDates ?? []));
      })
      .catch(() => setBookedDates(new Set()));
  }, []);

  return bookedDates;
}
