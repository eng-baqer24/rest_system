import { getAdminUser, unauthorizedResponse } from "@/lib/auth";
import { ensureMenuSeeded } from "@/lib/menu-sync";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    await ensureMenuSeeded();
    return NextResponse.json({ success: true, message: "تمت تهيئة قائمة الطعام بنجاح." });
  } catch (error) {
    console.error("Menu seed error:", error);
    return NextResponse.json(
      { error: "تعذّر استيراد قائمة الطعام التأسيسية." },
      { status: 500 }
    );
  }
}
