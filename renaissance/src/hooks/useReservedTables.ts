"use client";

import { useEffect, useState } from "react";

export function useReservedTables(date?: Date, time?: string) {
  const [tableIds, setTableIds] = useState<string[]>([]);

  useEffect(() => {
    if (!date || !time) {
      setTableIds([]);
      return;
    }

    const day = date.toISOString().split("T")[0];
    let cancelled = false;

    fetch(`/api/reservations/booked-tables?date=${day}&time=${encodeURIComponent(time)}`)
      .then((res) => (res.ok ? res.json() : { tableIds: [] }))
      .then((data) => {
        if (!cancelled) setTableIds(data.tableIds ?? []);
      })
      .catch(() => {
        if (!cancelled) setTableIds([]);
      });

    return () => {
      cancelled = true;
    };
  }, [date, time]);

  return tableIds;
}
