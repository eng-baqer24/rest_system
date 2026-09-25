"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, Users, MapPin, Sparkles, ArrowRight, Printer } from "lucide-react";
import { RESTAURANT_TABLES } from "@/data/restaurantTables";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tableId = searchParams.get("table");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const guests = searchParams.get("guests");

  const tableObj = RESTAURANT_TABLES.find((t) => t.id === tableId);

  return (
    <div className="container max-w-2xl px-4 py-16 md:px-6" dir="rtl">
      <div className="rounded-2xl border border-primary/30 bg-[#121215]/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="relative mx-auto size-20 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(201,162,39,0.3)] animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="size-10 text-primary" />
        </div>

        <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          تم تأكيد استلام حجزك بنجاح!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          يسعدنا استقبالك في مطعم رينيسانس. تم حجز طاولتك المحددة وتثبيتها في نظامنا عبر Supabase.
        </p>

        {/* Booking Card Voucher */}
        <div className="mt-8 rounded-xl border border-primary/30 bg-black/40 p-5 text-right space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs text-muted-foreground">رقم مرجع الحجز:</span>
            <span className="font-mono text-sm font-bold text-primary tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
              {id || "RN-SUCCESS"}
            </span>
          </div>

          {/* Table Details */}
          {tableObj ? (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-base px-2.5 py-1 rounded bg-primary text-black">
                  {tableObj.id}
                </span>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {tableObj.nameAr}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-primary" />
                    <span>{tableObj.zoneNameAr}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-primary font-medium flex items-center gap-1">
                <Sparkles className="size-3" /> تم تثبيت الطاولة
              </span>
            </div>
          ) : tableId ? (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">رقم الطاولة:</span>
              <span className="font-mono font-bold text-primary text-sm">{tableId}</span>
            </div>
          ) : null}

          {/* Date, Time, Guests */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
            {date && (
              <div className="p-2.5 rounded-lg bg-card/60 border border-border/50">
                <div className="text-muted-foreground flex items-center gap-1 mb-1">
                  <Calendar className="size-3 text-primary" /> التاريخ
                </div>
                <div className="font-medium text-foreground">{date}</div>
              </div>
            )}
            {time && (
              <div className="p-2.5 rounded-lg bg-card/60 border border-border/50">
                <div className="text-muted-foreground flex items-center gap-1 mb-1">
                  <Clock className="size-3 text-primary" /> وقت الحضور
                </div>
                <div className="font-medium text-foreground">{time}</div>
              </div>
            )}
            {guests && (
              <div className="p-2.5 rounded-lg bg-card/60 border border-border/50 col-span-2 sm:col-span-1">
                <div className="text-muted-foreground flex items-center gap-1 mb-1">
                  <Users className="size-3 text-primary" /> عدد الضيوف
                </div>
                <div className="font-medium text-foreground">{guests} أشخاص</div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground/80 leading-relaxed border-t border-border/40 pt-3">
            * يُرجى الحضور قبل الموعد بـ 10 دقائق لضمان جاهزية الطاولة وتقديم تجربة الضيافة الملكية المتكاملة.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
            size="lg"
          >
            <Link href="/">
              <span>العودة للرئيسية</span>
              <ArrowRight className="size-4 mr-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-primary/40 hover:bg-primary/10"
            size="lg"
          >
            <Link href="/menu">
              <span>استكشف قائمة الطعام</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-[60vh] items-center justify-center px-4 py-16">
          <p className="text-muted-foreground">جاري تحميل بيانات الحجز...</p>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
