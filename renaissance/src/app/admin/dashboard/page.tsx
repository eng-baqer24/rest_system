import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=config");
  }

  let user = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch {
    redirect("/admin/login?error=auth");
  }

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <AdminHeader email={user.email} />
      <main className="container mx-auto px-4 py-8 md:px-6">
        <AdminDashboardClient />
      </main>
    </div>
  );
}
