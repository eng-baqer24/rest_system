"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";

export function AnnouncementBanner() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data?.settings?.showAnnouncement && data?.settings?.announcementText) {
          setAnnouncement(data.settings.announcementText);
        }
      } catch (err) {
        console.error("Announcement fetch error:", err);
      }
    }
    loadSettings();
  }, []);

  if (!visible || !announcement || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/15 via-primary/25 to-primary/15 border-b border-primary/30 text-foreground py-2 px-4 text-xs font-medium relative z-50 text-center flex items-center justify-center gap-2">
      <Sparkles className="size-3.5 text-primary shrink-0 animate-pulse" />
      <span className="line-clamp-1">{announcement}</span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-muted-foreground hover:text-foreground mr-2 shrink-0"
        aria-label="إغلاق الإعلان"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
