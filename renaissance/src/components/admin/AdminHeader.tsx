"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ExternalLink, LogOut, UtensilsCrossed, User } from "lucide-react";

interface AdminHeaderProps {
  email?: string;
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 shadow-inner">
            <UtensilsCrossed className="size-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-semibold tracking-wide text-foreground">
                Renaissance Admin
              </h1>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                لوحة التحكم
              </span>
            </div>
            {email && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="size-3" />
                <span dir="ltr">{email}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">معاينة الموقع</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
