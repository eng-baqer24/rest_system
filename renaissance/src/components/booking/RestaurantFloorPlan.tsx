"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Check,
  Crown,
  Sparkles,
  Wine,
  Eye,
  TreePine,
  ShieldCheck,
  Compass,
  Utensils,
  MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RestaurantTable {
  id: string;
  number: number;
  name: string;
  nameAr: string;
  zone: "window" | "chandelier" | "front" | "private" | "terrace";
  zoneName: string;
  zoneNameAr: string;
  capacity: number;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
  status: "available" | "reserved";
  perk: string;
  perkAr: string;
  icon: "crown" | "tree" | "eye" | "wine" | "sparkles";
}

export const REAL_RESTAURANT_TABLES: RestaurantTable[] = [
  {
    id: "T-01",
    number: 1,
    name: "Royal Front Table",
    nameAr: "طاولة الصالة الأمامية الملكية",
    zone: "front",
    zoneName: "Front Hall",
    zoneNameAr: "مقدمة القاعة الفاخرة",
    capacity: 4,
    x: 18,
    y: 84,
    status: "available",
    perk: "Spacious front row dining with fine porcelain & crystal glassware",
    perkAr: "مساحة واسعة بمقدمة الصالة مع أطقم خزف وكريستال فاخرة",
    icon: "crown",
  },
  {
    id: "T-02",
    number: 2,
    name: "Garden Vista Table",
    nameAr: "طاولة إطلالة الحديقة والواجهة",
    zone: "window",
    zoneName: "Panoramic Window",
    zoneNameAr: "الواجهة الزجاجية البانورامية",
    capacity: 4,
    x: 82,
    y: 83,
    status: "available",
    perk: "Next to floor-to-ceiling panoramic glass overlooking the garden",
    perkAr: "بجوار الواجهة الزجاجية البانورامية المطلة على الحديقة مباشرةً",
    icon: "eye",
  },
  {
    id: "T-03",
    number: 3,
    name: "Grand Chandelier Table",
    nameAr: "طاولة الثريا الكبرى المركزية",
    zone: "chandelier",
    zoneName: "Grand Chandelier",
    zoneNameAr: "وسط الصالة تحت الثريا",
    capacity: 4,
    x: 48.5,
    y: 65,
    status: "available",
    perk: "Prime central position directly beneath the crystal chandelier",
    perkAr: "موقع مركزي مميز مباشرة تحت الثريا الكريستالية الكبرى",
    icon: "sparkles",
  },
  {
    id: "T-04",
    number: 4,
    name: "Velvet Lounge Booth",
    nameAr: "طاولة المقصورات المخملية",
    zone: "private",
    zoneName: "Velvet Lounge",
    zoneNameAr: "المقصورات المخملية الخاصة",
    capacity: 6,
    x: 13.5,
    y: 62,
    status: "available",
    perk: "Plush curved velvet banquette offering privacy and intimacy",
    perkAr: "أريكة مخملية دائرية فاخرة تمنحك خصوصية وراحة استثنائية",
    icon: "crown",
  },
  {
    id: "T-05",
    number: 5,
    name: "Skyline Glass Table 1",
    nameAr: "طاولة الواجهة الزجاجية 1",
    zone: "window",
    zoneName: "Panoramic Window",
    zoneNameAr: "الواجهة الزجاجية المطلة",
    capacity: 4,
    x: 74,
    y: 64,
    status: "available",
    perk: "Direct picturesque view of the Japanese garden trees",
    perkAr: "إطلالة ساحرة ومباشرة على أشجار الحديقة والواجهة الزجاجية",
    icon: "eye",
  },
  {
    id: "T-06",
    number: 6,
    name: "Skyline Glass Table 2",
    nameAr: "طاولة الواجهة الزجاجية 2",
    zone: "window",
    zoneName: "Panoramic Window",
    zoneNameAr: "الواجهة الزجاجية المطلة",
    capacity: 4,
    x: 64.5,
    y: 58,
    status: "available",
    perk: "Soft natural daylight with romantic glass-side ambiance",
    perkAr: "أجواء رومانسية هادئة بجانب الزجاج مع إضاءة طبيعية دافئة",
    icon: "eye",
  },
  {
    id: "T-07",
    number: 7,
    name: "Chamber Dining Table",
    nameAr: "طاولة وسط القاعة الهادئة",
    zone: "chandelier",
    zoneName: "Grand Chandelier",
    zoneNameAr: "وسط القاعة",
    capacity: 4,
    x: 49,
    y: 56,
    status: "available",
    perk: "Cozy central dining under warm ambient ceiling lighting",
    perkAr: "موقع هادئ في وسط القاعة مع إضاءة سقفية دافئة ومريحة",
    icon: "sparkles",
  },
  {
    id: "T-08",
    number: 8,
    name: "Outdoor Garden Terrace",
    nameAr: "طاولة شرفة الحديقة الخارجية",
    zone: "terrace",
    zoneName: "Garden Terrace",
    zoneNameAr: "شرفة الحديقة في الهواء الطلق",
    capacity: 4,
    x: 93,
    y: 61,
    status: "available",
    perk: "Open-air dining terrace with garden breeze",
    perkAr: "جلسة خارجية مميزة في الهواء الطلق بين خضرة الحديقة والنسيم العليل",
    icon: "tree",
  },
  {
    id: "T-09",
    number: 9,
    name: "Intimate Corner Table",
    nameAr: "طاولة الركن الهادئ",
    zone: "private",
    zoneName: "Velvet Lounge",
    zoneNameAr: "الأركان الهادئة",
    capacity: 2,
    x: 36,
    y: 56.5,
    status: "available",
    perk: "Intimate corner table for couples & special moments",
    perkAr: "طاولة ثنائية حميمة للأزواج واللحظات الخاصة في ركن هادئ",
    icon: "wine",
  },
  {
    id: "T-10",
    number: 10,
    name: "Sommelier Bar Table",
    nameAr: "طاولة قرب قبو وبار المشروبات",
    zone: "private",
    zoneName: "Velvet Lounge",
    zoneNameAr: "قرب اللاونج والبار",
    capacity: 2,
    x: 40,
    y: 53.5,
    status: "available",
    perk: "Near the illuminated sommelier wine display & artisan bar",
    perkAr: "بالقرب من بار المشروبات الفاخر وقبو العرض المضاء بأناقة",
    icon: "wine",
  },
];

interface RestaurantFloorPlanProps {
  selectedTableId?: string;
  onSelectTable: (table: RestaurantTable) => void;
  guestCount?: number;
  reservedTableIds?: string[];
  className?: string;
}

export function RestaurantFloorPlan({
  selectedTableId,
  onSelectTable,
  guestCount,
  reservedTableIds = [],
  className,
}: RestaurantFloorPlanProps) {
  const [activeZone, setActiveZone] = useState<string>("all");
  const [hoveredTable, setHoveredTable] = useState<RestaurantTable | null>(null);

  const selectedTable = REAL_RESTAURANT_TABLES.find((t) => t.id === selectedTableId);

  const filteredTables = REAL_RESTAURANT_TABLES.filter((t) => {
    if (activeZone === "all") return true;
    return t.zone === activeZone;
  });

  const getPerkIcon = (icon: RestaurantTable["icon"]) => {
    switch (icon) {
      case "crown":
        return <Crown className="size-4 text-amber-400" />;
      case "eye":
        return <Eye className="size-4 text-amber-400" />;
      case "tree":
        return <TreePine className="size-4 text-amber-400" />;
      case "wine":
        return <Wine className="size-4 text-amber-400" />;
      case "sparkles":
      default:
        return <Sparkles className="size-4 text-amber-400" />;
    }
  };

  return (
    <div className={cn("flex flex-col space-y-3 select-none", className)}>
      {/* Top Filter Pills & Status Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
        {/* Zone Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { id: "all", label: "جميع الطاولات • All" },
            { id: "window", label: "🪟 إطلالة الحديقة" },
            { id: "chandelier", label: "✨ تحت الثريا" },
            { id: "front", label: "👑 الصالة الأمامية" },
            { id: "private", label: "🛋️ مقصورات هادئة" },
            { id: "terrace", label: "🌿 الشرفة الخارجية" },
          ].map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => setActiveZone(zone.id)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1 transition-all text-xs font-medium cursor-pointer",
                activeZone === zone.id
                  ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.6)] font-bold"
                  : "border-border/60 bg-black/50 text-muted-foreground hover:border-amber-400/60 hover:text-foreground"
              )}
            >
              {zone.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full border border-amber-400 bg-amber-400/30 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            <span>متاح (Available)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/60" />
            <span className="text-emerald-400 font-semibold">المختار (Selected)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-zinc-600 border border-zinc-500" />
            <span>محجوز (Reserved)</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Restaurant Photo Canvas */}
      <div
        className="relative w-full aspect-[16/9] min-h-[320px] sm:min-h-[420px] md:min-h-[480px] rounded-2xl border-2 border-amber-500/40 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] group"
        style={{
          backgroundImage: "url('/restaurant-interior.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a1610",
        }}
      >
        {/* Direct Native Image - Guaranteed to load instantly */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/restaurant-interior.jpg"
          alt="Luxury Restaurant Interior"
          className="absolute inset-0 size-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.01]"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80";
          }}
        />


        {/* Subtle Ambient Vignette - Light and clear */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Atmospheric Spotlight Dimmer when a table is hovered */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none bg-black/30 transition-opacity duration-300",
            hoveredTable ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Top-left Restaurant Name Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none flex items-center gap-2 rounded-xl bg-black/80 px-3.5 py-1.5 border border-amber-400/40 backdrop-blur-md text-xs text-amber-300 shadow-xl">
          <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
          <span className="font-serif font-semibold tracking-wide">
            Renaissance Dining Hall • صالة رينيسانس
          </span>
        </div>

        {/* Top-right Interactive Guide Banner */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 rounded-xl bg-black/80 px-3 py-1.5 border border-white/20 backdrop-blur-md text-[11px] text-zinc-300 shadow-xl">
          <MousePointerClick className="size-3.5 text-amber-400 animate-bounce" />
          <span>مرّر الماوس فوق الطاولات وانقر لاختيارها</span>
        </div>

        {/* Interactive Table Hotspots Placed On The Photo */}
        <div className="absolute inset-0">
          {filteredTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isHovered = hoveredTable?.id === table.id;
            const isReserved =
              table.status === "reserved" || reservedTableIds.includes(table.id);

            return (
              <div
                key={table.id}
                style={{
                  left: `${table.x}%`,
                  top: `${table.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={cn("absolute", isHovered || isSelected ? "z-40" : "z-30")}
                onMouseEnter={() => setHoveredTable(table)}
                onMouseLeave={() => setHoveredTable(null)}
              >
                {/* 1. Concentric Golden Pulse Waves when Available */}
                {!isReserved && !isSelected && (
                  <>
                    <span className="absolute inset-0 -m-3 rounded-full border-2 border-amber-400/40 animate-ping opacity-40 pointer-events-none" />
                    <span className="absolute inset-0 -m-1.5 rounded-full bg-amber-400/20 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* 2. Radiant Aura when Hovered or Selected */}
                {(isHovered || isSelected) && (
                  <span className="absolute inset-0 -m-4 rounded-full bg-amber-400/30 blur-md animate-pulse pointer-events-none" />
                )}

                {/* 3. The Interactive Table Disc */}
                <motion.button
                  type="button"
                  disabled={isReserved}
                  onClick={() => {
                    if (!isReserved) {
                      onSelectTable(table);
                    }
                  }}
                  whileHover={{ scale: isReserved ? 1 : 1.3 }}
                  whileTap={{ scale: isReserved ? 1 : 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer shadow-2xl",
                    // Sizing
                    "size-11 sm:size-13",
                    isSelected
                      ? "bg-amber-400 text-black font-extrabold border-2 border-white shadow-[0_0_30px_rgba(251,191,36,1)] ring-4 ring-amber-400/60 scale-115"
                      : isReserved
                      ? "bg-zinc-900/85 text-zinc-500 border border-zinc-600 cursor-not-allowed opacity-55 backdrop-blur-md"
                      : isHovered
                      ? "bg-amber-400 text-black border-2 border-white shadow-[0_0_35px_rgba(251,191,36,0.95)] ring-4 ring-amber-400/50"
                      : "bg-black/85 text-amber-300 border-2 border-amber-400/90 hover:border-white shadow-[0_0_18px_rgba(0,0,0,0.8)] backdrop-blur-md"
                  )}
                >
                  {/* Table Badge Content */}
                  {isSelected ? (
                    <div className="flex flex-col items-center leading-none">
                      <Check className="size-5 stroke-[3] text-black" />
                      <span className="text-[8px] font-black uppercase text-black">T-{table.number}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center leading-none">
                      <span className="text-[11px] sm:text-xs font-serif font-black tracking-tight">
                        T-{table.number < 10 ? `0${table.number}` : table.number}
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] font-sans font-bold mt-0.5">
                        <Users className="size-2.5" />
                        {table.capacity}
                      </span>
                    </div>
                  )}

                  {/* Selected Green Check Badge */}
                  {isSelected && (
                    <span className="absolute -top-2 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-black text-[11px] font-black shadow-md shadow-emerald-500/80 border-2 border-white">
                      ✓
                    </span>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* 4. Luxury Floating Tooltip Card (Appears directly over the hovered table) */}
        <AnimatePresence>
          {hoveredTable && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{
                left: `${Math.min(Math.max(hoveredTable.x, 24), 76)}%`,
                top: `${hoveredTable.y > 55 ? hoveredTable.y - 25 : hoveredTable.y + 25}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-50 pointer-events-none w-72 sm:w-80 rounded-2xl border-2 border-amber-400 bg-black/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-foreground ring-2 ring-amber-400/30"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-amber-400/30 pb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    {getPerkIcon(hoveredTable.icon)}
                    <h4 className="font-serif text-base font-bold text-amber-400">
                      {hoveredTable.name} (T-{hoveredTable.number})
                    </h4>
                  </div>
                  <p className="text-xs text-amber-200 font-semibold font-arabic mt-0.5" dir="rtl">
                    {hoveredTable.nameAr}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    hoveredTable.status === "available"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  )}
                >
                  {hoveredTable.status === "available" ? "متاح • Available" : "محجوز • Reserved"}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Users className="size-4 text-amber-400" />
                  <span>
                    يتسع لـ <strong className="text-amber-400 font-bold">{hoveredTable.capacity}</strong> ضيوف
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Compass className="size-4 text-amber-400" />
                  <span className="truncate">{hoveredTable.zoneNameAr}</span>
                </div>
              </div>

              {/* Unique Perk Description */}
              <div className="mt-2.5 rounded-xl bg-amber-400/[0.08] p-2.5 border border-amber-400/25">
                <p className="text-xs text-amber-300 font-medium flex items-center gap-1.5 font-arabic" dir="rtl">
                  <Sparkles className="size-3.5 shrink-0 text-amber-400" />
                  <span>{hoveredTable.perkAr}</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  {hoveredTable.perk}
                </p>
              </div>

              {/* Callout Prompt */}
              <div className="mt-3 text-center text-xs font-bold py-1.5 rounded-xl bg-amber-400 text-black shadow-md shadow-amber-400/30 flex items-center justify-center gap-1.5">
                {hoveredTable.status === "available" ? (
                  hoveredTable.id === selectedTableId ? (
                    <span>✓ هذه الطاولة مختارة لحجزك حالياً</span>
                  ) : (
                    <>
                      <MousePointerClick className="size-3.5" />
                      <span>انقر هنا لاختيار هذه الطاولة (Click to Select)</span>
                    </>
                  )
                ) : (
                  <span>🔒 هذه الطاولة غير متاحة حالياً</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Hover Feedback Bar (Provides immediate interactive feedback) */}
      {hoveredTable && !selectedTable && (
        <div className="rounded-xl border border-amber-400/50 bg-amber-400/10 p-2.5 text-xs text-amber-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-400 text-black font-bold font-serif text-sm">
              T-{hoveredTable.number}
            </span>
            <span>
              أنت تؤشر على: <strong>{hoveredTable.nameAr}</strong> ({hoveredTable.capacity} مقاعد — {hoveredTable.zoneNameAr})
            </span>
          </div>
          <span className="font-bold text-amber-400">👈 انقر عليها لتأكيد حجزها</span>
        </div>
      )}

      {/* Selected Table Confirmation Banner */}
      {selectedTable ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-400/20 via-black/90 to-amber-400/20 p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-black font-serif font-black text-xl shadow-lg shadow-amber-400/50 border-2 border-white">
              T-{selectedTable.number < 10 ? `0${selectedTable.number}` : selectedTable.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base sm:text-lg text-foreground">
                  {selectedTable.nameAr} ({selectedTable.name})
                </h4>
                <span className="rounded-md bg-amber-400/25 border border-amber-400/50 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                  {selectedTable.zoneNameAr}
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 font-arabic" dir="rtl">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Users className="size-3.5 text-amber-400" /> {selectedTable.capacity} مقاعد
                </span>
                <span>•</span>
                <span className="text-amber-300 font-medium">{selectedTable.perkAr}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/50 px-3.5 py-1 text-xs text-emerald-400 font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="size-4" /> تم اختيار هذه الطاولة لحجزك
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-xl border border-dashed border-amber-400/40 bg-black/40 p-3 text-center text-xs text-muted-foreground">
          👇 <strong className="text-amber-400">انقر مباشرةً على أي طاولة داخل صورة المطعم أعلاه لاختيارها</strong> • Click directly on any table in the restaurant photo above to select it
        </div>
      )}
    </div>
  );
}
