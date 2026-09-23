"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const isAuth =
      localStorage.getItem("admin_auth") === "true" ||
      document.cookie.includes("admin_session=authenticated");
    if (isAuth) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      triggerShake();
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "بيانات الدخول غير صحيحة");
        triggerShake();
        setIsLoading(false);
        return;
      }

      // Success
      setIsSuccess(true);
      localStorage.setItem("admin_auth", "true");
      localStorage.setItem("admin_name", data.user?.name || "إدارة المطعم");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1100);
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.");
      triggerShake();
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const fillDefaultCreds = () => {
    setUsername("admin");
    setPassword("renaissance2025");
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#09090b] text-foreground px-4 py-12">
      {/* Dynamic Animated Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing orbs */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.28, 0.15],
            x: [0, 25, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.22, 0.1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-amber-600/20 blur-[140px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

        {/* Subtle grid line pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake ? [-8, 8, -6, 6, -3, 3, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          x: { duration: 0.5 },
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glowing border wrapper */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-primary/40 via-border/50 to-primary/10 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="rounded-3xl bg-[#0f0f12]/90 p-7 sm:p-9 border border-white/5">
            {/* Header / Logo Icon */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-amber-500/20 border border-primary/40 text-primary shadow-inner mb-4 relative group"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <UtensilsCrossed className="w-8 h-8 text-primary" />
                </motion.div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary/80 animate-ping" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white"
              >
                Renaissance Restaurant
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-2 flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-primary font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة تحكم الإدارة — Admin Portal</span>
              </motion.div>

              <p className="mt-2 text-xs text-muted-foreground">
                منطقة محمية خاصة بمالك وإدارة المطعم لإدارة الحجوزات والمنيو
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="p-3.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
                    <span>تم التحقق بنجاح! جاري تحويلك إلى لوحة التحكم...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username Input */}
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-medium text-foreground/80 flex items-center justify-between">
                  <span>اسم المستخدم</span>
                  <span className="text-[11px] text-muted-foreground font-mono">admin</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    disabled={isLoading || isSuccess}
                    autoComplete="username"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-black/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-right">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground/80">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-[11px] text-primary/80 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>بيانات الدخول؟</span>
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isLoading || isSuccess}
                    autoComplete="current-password"
                    className="w-full pr-10 pl-11 py-3 rounded-xl bg-black/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hint Box (Collapsible) */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          بيانات الأدمن الافتراضية:
                        </span>
                        <button
                          type="button"
                          onClick={fillDefaultCreds}
                          className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-medium hover:bg-primary/90 transition-colors"
                        >
                          تعبئة تلقائية
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-muted-foreground pt-1">
                        <div>اسم المستخدم: <strong className="text-foreground">admin</strong></div>
                        <div>كلمة السر: <strong className="text-foreground">renaissance2025</strong></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full py-6 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary via-amber-500 to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>جاري تسجيل الدخول...</span>
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>مرحباً بعودتك!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>دخول لوحة التحكم</span>
                      <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Quick Helper / Auto-fill button */}
            <div className="mt-6 pt-5 border-t border-border/40 text-center">
              <button
                type="button"
                onClick={fillDefaultCreds}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>اضغط هنا لتعبئة بيانات الدخول للمعاينة السريعة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors"
          >
            <span>← العودة إلى موقع مطعم Renaissance</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
