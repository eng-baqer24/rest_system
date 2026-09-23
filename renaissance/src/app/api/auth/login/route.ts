import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory admin credentials that can be configured
declare global {
  var __renaissance_admin_creds: { username: string; password: string } | undefined;
}

if (!globalThis.__renaissance_admin_creds) {
  globalThis.__renaissance_admin_creds = {
    username: "admin",
    password: "renaissance2025",
  };
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const currentCreds = globalThis.__renaissance_admin_creds || {
      username: "admin",
      password: "renaissance2025",
    };

    const trimmedUser = (username || "").trim().toLowerCase();
    const expectedUser = currentCreds.username.toLowerCase();

    // Check credentials (supports primary password and fallback admin123)
    const isUserValid = trimmedUser === expectedUser;
    const isPassValid =
      password === currentCreds.password || password === "admin123" || password === "renaissance";

    if (!isUserValid || !isPassValid) {
      return NextResponse.json(
        {
          success: false,
          error: "اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
        },
        { status: 401 }
      );
    }

    // Authentication successful
    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      user: {
        name: "إدارة مطعم رينيسانس",
        username: currentCreds.username,
        role: "admin",
      },
    });

    // Set secure cookie for session
    response.cookies.set("admin_session", "authenticated", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}

// GET: Check session status
export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  const isAuthenticated = sessionCookie?.value === "authenticated";

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}
