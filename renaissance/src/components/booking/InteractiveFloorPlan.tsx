"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RESTAURANT_TABLES,
  RESTAURANT_ZONES,
  RestaurantTable,
} from "@/data/restaurantTables";
import {
  Users,
  Check,
  Ban,
  Sparkles,
  Crown,
  Trees,
  Info,
  MapPin,
  ChevronRight,
  Eye,
  Grid3X3,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InteractiveFloorPlanProps {
  selectedTableId?: string | null;
  onSelectTable: (table: RestaurantTable) => void;
  bookedTableIds: string[];
  guestsCount: number;
  isLoadingAvailability?: boolean;
  selectedDate?: string;
  selectedTime?: string;
}

export function InteractiveFloorPlan({
  selectedTableId,
  onSelectTable,
  bookedTableIds = [],
  guestsCount = 2,
  isLoadingAvailability = false,
  selectedDate,
  selectedTime,
}: InteractiveFloorPlanProps) {
  const [activeZone, setActiveZone] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [hoveredTable, setHoveredTable] = useState<RestaurantTable | null>(null);

  // Filter tables by active zone
  const filteredTables =
    activeZone === "all"
      ? RESTAURANT_TABLES
      : RESTAURANT_TABLES.filter((t) => t.zone === activeZone);

  // Active selected table object
  const activeTableObj = RESTAURANT_TABLES.find((t) => t.id === selectedTableId);

  // Statistics
  const totalTables = RESTAURANT_TABLES.length;
  const bookedCount = bookedTableIds.length;
  const availableCount = Math.max(0, totalTables - bookedCount);

  return (
    <div className="w-full space-y-6" dir="rtl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="size-5 text-primary animate-pulse" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              الخريطة البصرية لصالة المطعم
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            اختر طاولتك المفضلة من خريطة الصالة. الطاولات الذهبية متاحة، والحمراء محجوزة.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-card/80 p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === "map"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Compass className="size-3.5" />
            <span>المخطط البصري</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid3X3 className="size-3.5" />
            <span>عرض البطاقات</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Badge & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur-md p-3.5 rounded-xl border border-primary/20 text-xs sm:text-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-primary ring-2 ring-primary/30" />
            <span className="text-muted-foreground">محددة للحجز</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-emerald-500/80 ring-2 ring-emerald-500/20" />
            <span className="text-muted-foreground">
              متاحة ({availableCount})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-red-600/80 ring-2 ring-red-600/20" />
            <span className="text-muted-foreground">
              محجوزة ({bookedCount})
            </span>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-xs">
          {isLoadingAvailability ? (
            <span className="flex items-center gap-1.5 text-primary animate-pulse">
              <span className="size-2 rounded-full bg-primary" />
              جاري فحص توافر الطاولات عبر Supabase...
            </span>
          ) : (
            <span className="text-muted-foreground/80 flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              {selectedDate && selectedTime ? (
                <span>
                  محدّث لتاريخ{" "}
                  <strong className="text-foreground">{selectedDate}</strong> الساعة{" "}
                  <strong className="text-foreground">{selectedTime}</strong>
                </span>
              ) : (
                <span>بيانات فورية متصلة بقاعدة البيانات</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Zone Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveZone("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
            activeZone === "all"
              ? "bg-primary text-primary-foreground border-primary font-semibold shadow-[0_0_12px_rgba(201,162,39,0.3)]"
              : "bg-card/70 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
          )}
        >
          كافة أرجاء المطعم ({RESTAURANT_TABLES.length})
        </button>

        {RESTAURANT_ZONES.map((zone) => {
          const count = RESTAURANT_TABLES.filter((t) => t.zone === zone.id).length;
          const isSelected = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => setActiveZone(zone.id)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-[0_0_12px_rgba(201,162,39,0.3)]"
                  : "bg-card/70 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              )}
            >
              {zone.id === "window" && <Sparkles className="size-3" />}
              {zone.id === "main" && <Crown className="size-3" />}
              {zone.id === "terrace" && <Trees className="size-3" />}
              <span>{zone.nameAr}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Table Alert / Banner */}
      {activeTableObj && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 shadow-[0_0_20px_rgba(201,162,39,0.15)]"
        >
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              {activeTableObj.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm sm:text-base">
                  {activeTableObj.nameAr}
                </span>
                <Badge variant="outline" className="text-primary border-primary/40 text-[10px]">
                  {activeTableObj.zoneNameAr}
                </Badge>
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Users className="size-2.5" /> تتسع لـ {activeTableObj.capacity} أشخاص
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeTableObj.descriptionAr}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              <Check className="size-4 text-primary" /> تم تثبيت الطاولة لحجزك
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Floor Plan Views */}
      {viewMode === "map" ? (
        /* ARCHITECTURAL VISUAL FLOOR PLAN */
        <div className="relative w-full rounded-2xl border border-primary/30 bg-[#0d0d0f] overflow-hidden p-4 sm:p-6 shadow-2xl">
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #C9A227 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Architectural Layout Labels & Boundaries */}
          <div className="relative mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-center pointer-events-none">
            {/* Zone 1 Label */}
            <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                منطقة النوافذ البانورامية (Window View)
              </span>
            </div>
            {/* Zone 2 Label */}
            <div className="p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 flex items-center justify-center gap-2">
              <Crown className="size-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300">
                الصالة الملكية المركزية (Royal Hall)
              </span>
            </div>
            {/* Zone 3 Label */}
            <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center gap-2">
              <Trees className="size-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">
                شرفة الحديقة المفتوحة (Garden Terrace)
              </span>
            </div>
          </div>

          {/* Architectural Room Cues */}
          <div className="relative flex flex-col gap-8">
            {/* Top Bar / Facade Marker */}
            <div className="w-full flex items-center justify-between text-[11px] text-muted-foreground/60 border-b border-border/40 pb-2 px-2">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-sky-400/60" /> واجهة زجاجية مطلة على أفق المدينة
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-amber-400/60" /> ثريا كريستالية مركزية
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-400/60" /> هواء طلق وأشجار زيتون
              </span>
            </div>

            {/* Layout Columns representing the 3 restaurant sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* SECTION 1: WINDOW AREA */}
              <div
                className={cn(
                  "flex flex-col gap-4 p-4 rounded-xl border border-primary/20 bg-[#121215]/80 transition-all",
                  activeZone !== "all" && activeZone !== "window" && "opacity-40"
                )}
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="size-3.5" />
                    <span>واجهة النوافذ الزجاجية</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">4 طاولات</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3.5">
                  {RESTAURANT_TABLES.filter((t) => t.zone === "window").map((table) => (
                    <TableVisualCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      isBooked={bookedTableIds.includes(table.id)}
                      guestsCount={guestsCount}
                      onSelect={() => onSelectTable(table)}
                      onHover={() => setHoveredTable(table)}
                      onLeave={() => setHoveredTable(null)}
                    />
                  ))}
                </div>
              </div>

              {/* SECTION 2: MAIN ROYAL HALL */}
              <div
                className={cn(
                  "flex flex-col gap-4 p-4 rounded-xl border border-amber-500/20 bg-[#121215]/80 transition-all",
                  activeZone !== "all" && activeZone !== "main" && "opacity-40"
                )}
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <Crown className="size-3.5" />
                    <span>الصالة الملكية الوسطى</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">6 طاولات</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3.5">
                  {RESTAURANT_TABLES.filter((t) => t.zone === "main").map((table) => (
                    <TableVisualCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      isBooked={bookedTableIds.includes(table.id)}
                      guestsCount={guestsCount}
                      onSelect={() => onSelectTable(table)}
                      onHover={() => setHoveredTable(table)}
                      onLeave={() => setHoveredTable(null)}
                    />
                  ))}
                </div>
              </div>

              {/* SECTION 3: GARDEN TERRACE */}
              <div
                className={cn(
                  "flex flex-col gap-4 p-4 rounded-xl border border-emerald-500/20 bg-[#121215]/80 transition-all",
                  activeZone !== "all" && activeZone !== "terrace" && "opacity-40"
                )}
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <Trees className="size-3.5" />
                    <span>شرفة الحديقة المفتوحة</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">4 طاولات</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3.5">
                  {RESTAURANT_TABLES.filter((t) => t.zone === "terrace").map((table) => (
                    <TableVisualCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      isBooked={bookedTableIds.includes(table.id)}
                      guestsCount={guestsCount}
                      onSelect={() => onSelectTable(table)}
                      onHover={() => setHoveredTable(table)}
                      onLeave={() => setHoveredTable(null)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Architectural Features: Entrance, Reception, Bar */}
            <div className="pt-4 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-muted-foreground/70">
              <div className="py-2 px-3 rounded-lg border border-dashed border-border/60 bg-card/20 flex items-center justify-center gap-1.5">
                <MapPin className="size-3.5 text-primary/70" />
                <span>المدخل الرئيسي وقسم الاستقبال والترحيب</span>
              </div>
              <div className="py-2 px-3 rounded-lg border border-dashed border-border/60 bg-card/20 flex items-center justify-center gap-1.5">
                <Sparkles className="size-3.5 text-primary/70" />
                <span>بار المشروبات الفاخرة والموهيتو الملكي</span>
              </div>
              <div className="py-2 px-3 rounded-lg border border-dashed border-border/60 bg-card/20 flex items-center justify-center gap-1.5">
                <Trees className="size-3.5 text-emerald-500/70" />
                <span>ممشى الحديقة الخارجية والموسيقى الحية</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTables.map((table) => (
            <TableVisualCard
              key={table.id}
              table={table}
              isSelected={selectedTableId === table.id}
              isBooked={bookedTableIds.includes(table.id)}
              guestsCount={guestsCount}
              onSelect={() => onSelectTable(table)}
              onHover={() => setHoveredTable(table)}
              onLeave={() => setHoveredTable(null)}
              detailed
            />
          ))}
        </div>
      )}

      {/* Hover / Quick Preview Box */}
      <AnimatePresence>
        {hoveredTable && !activeTableObj && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="p-3.5 rounded-xl bg-card/95 border border-primary/30 backdrop-blur-md shadow-lg flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-primary text-sm px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
                {hoveredTable.id}
              </span>
              <span className="font-semibold text-foreground">
                {hoveredTable.nameAr}
              </span>
              <span className="text-muted-foreground">• {hoveredTable.descriptionAr}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">السعة: {hoveredTable.capacity} أشخاص</span>
              {bookedTableIds.includes(hoveredTable.id) ? (
                <Badge variant="destructive" className="text-[10px]">
                  محجوزة
                </Badge>
              ) : (
                <Badge className="bg-emerald-600/90 text-white text-[10px]">
                  متاحة للنقر
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// TABLE VISUAL CARD COMPONENT
// -------------------------------------------------------------
interface TableVisualCardProps {
  table: RestaurantTable;
  isSelected: boolean;
  isBooked: boolean;
  guestsCount: number;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  detailed?: boolean;
}

function TableVisualCard({
  table,
  isSelected,
  isBooked,
  guestsCount,
  onSelect,
  onHover,
  onLeave,
  detailed = false,
}: TableVisualCardProps) {
  // Check if table capacity is less than requested guests
  const isUndersized = table.capacity < guestsCount;

  return (
    <motion.div
      whileHover={!isBooked ? { scale: 1.02 } : {}}
      whileTap={!isBooked ? { scale: 0.98 } : {}}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => {
        if (!isBooked) {
          onSelect();
        }
      }}
      className={cn(
        "relative rounded-xl p-3.5 transition-all select-none duration-200 border text-right",
        // Booked State (محجوزة)
        isBooked &&
          "bg-gradient-to-br from-red-950/25 to-[#160d0f] border-red-900/40 text-muted-foreground/60 cursor-not-allowed opacity-75 backdrop-blur-sm",
        // Selected State (محددة - Golden Luxury Glow)
        isSelected &&
          "bg-gradient-to-br from-[#FFE885] to-[#C9A227] text-black border-2 border-white/80 shadow-[0_0_30px_rgba(201,162,39,0.7)] font-semibold scale-[1.02] ring-2 ring-primary/40",
        // Available State (متاحة)
        !isBooked &&
          !isSelected &&
          "bg-[#18181b]/90 hover:bg-[#202025] border-border/80 hover:border-primary/70 hover:shadow-[0_0_18px_rgba(201,162,39,0.25)] cursor-pointer text-foreground"
      )}
    >
      {/* Top Row: Table ID, Seats & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {/* Table ID Badge */}
          <span
            className={cn(
              "font-mono text-xs font-bold px-2 py-0.5 rounded-md tracking-wider shadow-sm",
              isSelected
                ? "bg-black text-[#FFE885]"
                : isBooked
                ? "bg-red-950/60 text-red-400 border border-red-900/60"
                : "bg-primary/15 text-primary border border-primary/30"
            )}
          >
            {table.id}
          </span>

          {/* Table Name */}
          <span
            className={cn(
              "text-xs sm:text-sm font-semibold truncate",
              isSelected ? "text-black" : "text-foreground"
            )}
          >
            {table.nameAr}
          </span>
        </div>

        {/* Status Indicator Badge */}
        {isBooked ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
            <Ban className="size-3" />
            <span>محجوزة</span>
          </span>
        ) : isSelected ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-black bg-white/90 px-2 py-0.5 rounded shadow-sm">
            <Check className="size-3.5 stroke-[3]" />
            <span>محددة</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>متاحة</span>
          </span>
        )}
      </div>

      {/* Visual Table & Chairs Illustration */}
      <div className="my-2.5 flex items-center justify-between py-1 px-2 rounded-lg bg-black/20 border border-white/5">
        {/* Table representation icon */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-7 rounded-md flex items-center justify-center font-bold text-xs shadow-inner",
              isSelected
                ? "bg-black/80 text-white"
                : isBooked
                ? "bg-red-900/40 text-red-300"
                : "bg-primary/20 text-primary border border-primary/30"
            )}
          >
            {table.shape === "round" && "○"}
            {table.shape === "rect" && "▭"}
            {table.shape === "booth" && "⊔"}
            {table.shape === "vip" && "★"}
          </div>

          <div className="text-[11px] leading-tight">
            <div className={cn("font-medium", isSelected ? "text-black" : "text-foreground")}>
              {table.zoneNameAr}
            </div>
            <div
              className={cn(
                "text-[10px]",
                isSelected ? "text-black/70" : "text-muted-foreground"
              )}
            >
              {table.shape === "booth"
                ? "جلسة بوث مخملية"
                : table.shape === "round"
                ? "طاولة مستديرة"
                : table.shape === "vip"
                ? "مأدبة ممتدة VIP"
                : "طاولة مستطيلة"}
            </div>
          </div>
        </div>

        {/* Capacity dots */}
        <div className="flex items-center gap-1 text-xs">
          <Users
            className={cn(
              "size-3.5",
              isSelected ? "text-black" : isBooked ? "text-red-400" : "text-primary"
            )}
          />
          <span
            className={cn(
              "font-semibold text-xs",
              isSelected ? "text-black" : "text-foreground"
            )}
          >
            {table.capacity}
          </span>
          <span
            className={cn(
              "text-[10px]",
              isSelected ? "text-black/70" : "text-muted-foreground"
            )}
          >
            أشخاص
          </span>
        </div>
      </div>

      {/* Description or Highlights */}
      <p
        className={cn(
          "text-[11px] line-clamp-2 leading-relaxed mt-1",
          isSelected ? "text-black/85" : "text-muted-foreground"
        )}
      >
        {table.descriptionAr}
      </p>

      {/* Feature tags */}
      <div className="flex flex-wrap gap-1 mt-2.5">
        {table.featuresAr.slice(0, 2).map((feat, idx) => (
          <span
            key={idx}
            className={cn(
              "text-[9px] px-1.5 py-0.5 rounded",
              isSelected
                ? "bg-black/15 text-black font-medium"
                : isBooked
                ? "bg-red-950/40 text-red-300/60"
                : "bg-card text-muted-foreground border border-border/40"
            )}
          >
            {feat}
          </span>
        ))}
        {isUndersized && !isBooked && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            تتسع لـ {table.capacity} فقط
          </span>
        )}
      </div>

      {/* Action Footer if Available */}
      {!isBooked && (
        <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between">
          <span
            className={cn(
              "text-[10px] font-medium flex items-center gap-1",
              isSelected ? "text-black font-bold" : "text-primary"
            )}
          >
            {isSelected ? "تم الاختيار ✓" : "انقر لتحديد هذه الطاولة"}
          </span>
          <ChevronRight
            className={cn(
              "size-3 transition-transform",
              isSelected ? "rotate-90 text-black" : "text-primary"
            )}
          />
        </div>
      )}
    </motion.div>
  );
}
