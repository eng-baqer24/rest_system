"use client";

import { useState } from "react";
import { MenuManagement } from "@/components/admin/MenuManagement";
import {
  ReservationsManagement,
  type ReservationStats,
} from "@/components/admin/ReservationsManagement";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  LayoutGrid,
  UtensilsCrossed,
} from "lucide-react";

export function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<"menu" | "reservations" | "all">("all");
  const [dishCount, setDishCount] = useState<number>(0);
  const [reservationStats, setReservationStats] = useState<ReservationStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-wide text-foreground">
            لوحة الإدارة والتحكم
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            إدارة متكاملة لقائمة مأكولات مطعم Renaissance ومتابعة حجوزات الطاولات المباشرة
          </p>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Dishes */}
        <Card className="border-border/80 bg-card/60 backdrop-blur transition-transform hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <UtensilsCrossed className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">أطباق القائمة</p>
              <h3 className="font-serif text-2xl font-bold text-foreground mt-0.5">
                {dishCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">صنف مسجل</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Reservations */}
        <Card className="border-border/80 bg-card/60 backdrop-blur transition-transform hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
              <CalendarDays className="size-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">إجمالي الحجوزات</p>
              <h3 className="font-serif text-2xl font-bold text-foreground mt-0.5">
                {reservationStats.total}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">حجز مسجل</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reservations */}
        <Card className="border-border/80 bg-card/60 backdrop-blur transition-transform hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
              <Clock className="size-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">بانتظار التأكيد</p>
              <h3 className="font-serif text-2xl font-bold text-amber-400 mt-0.5">
                {reservationStats.pending}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">حاجة للمراجعة</p>
            </div>
          </CardContent>
        </Card>

        {/* Confirmed Reservations */}
        <Card className="border-border/80 bg-card/60 backdrop-blur transition-transform hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10">
              <CheckCircle className="size-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">الحجوزات المؤكدة</p>
              <h3 className="font-serif text-2xl font-bold text-green-400 mt-0.5">
                {reservationStats.confirmed}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">جاهزة للاستقبال</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          }`}
        >
          <LayoutGrid className="size-4" />
          <span>العرض الشامل</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "menu"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          }`}
        >
          <UtensilsCrossed className="size-4" />
          <span>قائمة الطعام</span>
          <span className="rounded-full bg-background/30 px-1.5 py-0.2 text-xs">
            {dishCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reservations")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "reservations"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          }`}
        >
          <CalendarDays className="size-4" />
          <span>حجوزات الطاولات</span>
          {reservationStats.pending > 0 && (
            <span className="rounded-full bg-amber-500/30 px-1.5 py-0.2 text-xs text-amber-300 font-bold">
              {reservationStats.pending}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-8">
        {(activeTab === "all" || activeTab === "menu") && (
          <MenuManagement onDishCountChange={setDishCount} />
        )}

        {(activeTab === "all" || activeTab === "reservations") && (
          <ReservationsManagement onStatsChange={setReservationStats} />
        )}
      </div>
    </div>
  );
}
