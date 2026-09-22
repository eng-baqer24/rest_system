"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Loader2, Lock, Mail, ShieldAlert, Sparkles, UserPlus } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
  const authError = searchParams.get("error");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    authError === "auth"
      ? "فشل تسجيل الدخول. يرجى التأكد من البيانات والمحاولة مجدداً."
      : authError === "config"
      ? "إعدادات Supabase غير مكتملة في متغيرات البيئة."
      : ""
  );
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(
            signInError.message.includes("Invalid login")
              ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
              : signInError.message
          );
          setLoading(false);
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          setSuccess("تم إنشاء حساب المسؤول بنجاح! جاري التوجيه...");
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 1000);
        } else {
          setSuccess(
            "تم إنشاء الحساب بنجاح. إذا كان تأكيد البريد مفعّلاً في Supabase، يرجى تفقّد بريدك لتأكيده ثم سجّل الدخول."
          );
          setMode("login");
        }
      }
    } catch {
      setError("تعذّر الاتصال بخدمة Supabase. تأكد من إعدادات المفاتيح في .env.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-primary/30 bg-card/95 shadow-2xl backdrop-blur">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-inner">
          <Lock className="size-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl tracking-wide text-foreground">
          لوحة تحكم المطعم
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {mode === "login"
            ? "سجّل الدخول للوصول إلى إدارة القائمة والحجوزات"
            : "أنشئ حساب مسؤول جديد للوصول إلى لوحة التحكم"}
        </CardDescription>

        <div className="mt-2 flex rounded-lg border border-border/80 bg-background/50 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
              mode === "login"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
              mode === "signup"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            حساب مسؤول جديد
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@renaissance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 focus-visible:ring-primary"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 focus-visible:ring-primary"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <ShieldAlert className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <Button type="submit" className="w-full font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : mode === "login" ? (
              <>
                <Sparkles className="size-4" />
                تسجيل الدخول
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                إنشاء حساب مسؤول
              </>
            )}
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowRight className="size-3.5" />
            العودة إلى موقع المطعم الرئيسي
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-card/30 to-background p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
