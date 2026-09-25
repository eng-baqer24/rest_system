"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RESTAURANT_TABLES,
  RESTAURANT_SCENES,
  RestaurantTable,
  SceneId,
} from "@/data/restaurantTables";
import {
  Users,
  Ban,
  Sparkles,
  Crown,
  Trees,
  ChevronLeft,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  Gem,
  Building2,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VisualPhotoFloorPlanProps {
  selectedTableId?: string | null;
  onSelectTable: (table: RestaurantTable) => void;
  onProceedToBooking?: () => void;
  bookedTableIds: string[];
  guestsCount?: number;
  isLoadingAvailability?: boolean;
}

type CapacityFilter = "all" | "2" | "4" | "vip" | "booth";

export function VisualPhotoFloorPlan({
  selectedTableId,
  onSelectTable,
  onProceedToBooking,
  bookedTableIds = [],
  isLoadingAvailability = false,
}: VisualPhotoFloorPlanProps) {
  // Active luxury restaurant scene
  const [activeSceneId, setActiveSceneId] = useState<SceneId>("interior");
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null);
  const [justClickedTableId, setJustClickedTableId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Table options filter state
  const [tableFilter, setTableFilter] = useState<CapacityFilter>("all");

  const currentScene =
    RESTAURANT_SCENES.find((s) => s.id === activeSceneId) || RESTAURANT_SCENES[0];

  // Active selected table object across all scenes
  const activeTableObj = RESTAURANT_TABLES.find((t) => t.id === selectedTableId);

  // If selectedTable belongs to another scene, switch scene to display it
  useEffect(() => {
    if (activeTableObj && activeTableObj.scene !== activeSceneId) {
      setActiveSceneId(activeTableObj.scene);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [selectedTableId]);

  // Tables for the active scene displayed on the realistic photo
  const sceneTables = RESTAURANT_TABLES.filter((t) => t.scene === activeSceneId);

  // Stats for the active scene
  const sceneBookedCount = sceneTables.filter((t) => bookedTableIds.includes(t.id)).length;
  const sceneAvailableCount = Math.max(0, sceneTables.length - sceneBookedCount);

  // Filtered tables for the "خيارات الطاولات المتعددة" card grid
  const filteredAllTables = RESTAURANT_TABLES.filter((t) => {
    if (tableFilter === "2") return t.capacity === 2;
    if (tableFilter === "4") return t.capacity === 4;
    if (tableFilter === "vip") return t.capacity >= 6 || t.shape === "vip";
    if (tableFilter === "booth") return t.shape === "booth";
    return true;
  });

  const handleTableClick = (table: RestaurantTable, isBooked: boolean) => {
    if (isBooked) return;
    setJustClickedTableId(table.id);
    onSelectTable(table);
    if (table.scene !== activeSceneId) {
      setActiveSceneId(table.scene);
      setImageError(false);
      setImageLoaded(false);
    }
    setTimeout(() => {
      setJustClickedTableId(null);
    }, 900);
  };

  const handleSceneChange = (sceneId: SceneId) => {
    if (sceneId === activeSceneId) return;
    setActiveSceneId(sceneId);
    setImageError(false);
    setImageLoaded(false);
  };

  const getSceneIcon = (id: SceneId) => {
    switch (id) {
      case "interior":
        return <Crown className="size-3.5 text-primary" />;
      case "michelin":
        return <Gem className="size-3.5 text-amber-300" />;
      case "palace":
        return <Building2 className="size-3.5 text-sky-400" />;
      case "terrace":
        return <Trees className="size-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      {/* ======================================================================= */}
      {/* 1. SCENE SWITCHER & VIEW HEADER */}
      {/* ======================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-primary/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary animate-pulse" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              صورة المطعم الفاخر واختيار الطاولات
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            اختر صالتك المفضلة وانقر مباشرة على الطاولة المضيئة داخل الصورة، أو اختر من قائمة الخيارات المتعددة أدناه
          </p>
        </div>

        {/* 4 Luxury Dining Scene Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-primary/30 flex-wrap shadow-xl">
          {RESTAURANT_SCENES.map((scene) => {
            const isSelected = activeSceneId === scene.id;
            const count = RESTAURANT_TABLES.filter((t) => t.scene === scene.id).length;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSceneChange(scene.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 select-none",
                  isSelected
                    ? "bg-primary text-black font-extrabold shadow-[0_0_15px_rgba(201,162,39,0.5)] scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/80"
                )}
              >
                {getSceneIcon(scene.id)}
                <span>{scene.nameAr}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isSelected ? "bg-black/20 text-black font-black" : "bg-card text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. REAL-TIME AVAILABILITY & SCENE STATS BAR */}
      {/* ======================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-card/60 border border-border/80 text-xs backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-gradient-to-r from-[#FFE885] to-primary ring-2 ring-primary/40 animate-pulse" />
            <span className="text-foreground font-semibold">طاولة محددة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="text-muted-foreground">متاحة في الصالة ({sceneAvailableCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-600 ring-2 ring-red-600/20" />
            <span className="text-muted-foreground">محجوزة ({sceneBookedCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoadingAvailability && (
            <span className="flex items-center gap-1.5 text-primary text-xs animate-pulse">
              <span className="size-2 rounded-full bg-primary" />
              جاري فحص توافر الطاولات عبر Supabase...
            </span>
          )}
          <span className="text-[11px] text-primary/90 hidden sm:inline-flex items-center gap-1 font-medium">
            <Sparkles className="size-3 text-primary" />
            مرر الفأرة فوق الطاولة لمعاينة تفاصيلها، أو انقر للاختيار الفوري
          </span>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 3. ULTRA LUXURY RESTAURANT PHOTO WITH INTERACTIVE TABLE HOTSPOTS */}
      {/* ======================================================================= */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border-2 border-primary/50 shadow-[0_15px_50px_rgba(0,0,0,0.85)] bg-zinc-950 group select-none">
        {/* Loading state skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex flex-col items-center justify-center gap-3">
            <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-xs text-primary/80 font-serif">جاري تحميل صورة المطعم الفاخرة...</span>
          </div>
        )}

        {/* The Luxury Restaurant Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageError ? currentScene.fallbackSrc : currentScene.imageSrc}
          alt={currentScene.nameAr}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        />

        {/* Subtle Luxury Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35 pointer-events-none z-10" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-primary/50 text-xs font-semibold text-primary flex items-center gap-2 shadow-2xl">
            {getSceneIcon(currentScene.id)}
            <span>{currentScene.nameAr}</span>
            <span className="text-[10px] text-muted-foreground">({currentScene.badgeAr})</span>
          </span>
        </div>

        <div className="absolute top-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 text-xs text-white/90 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary/40 shadow-xl">
          <Sparkles className="size-3.5 text-primary animate-pulse" />
          <span>انقر على الطاولة لاختيارها مباشرة</span>
        </div>

        {/* ======================================================================= */}
        {/* INTERACTIVE TABLE HOTSPOT PINS */}
        {/* ======================================================================= */}
        {sceneTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const isBooked = bookedTableIds.includes(table.id);
          const isHovered = hoveredTableId === table.id;
          const isJustClicked = justClickedTableId === table.id;

          return (
            <div
              key={table.id}
              style={{
                left: `${table.photoPos.x}%`,
                top: `${table.photoPos.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              {/* Click Ripple Wave Animation */}
              {isJustClicked && (
                <span className="absolute inset-0 rounded-full bg-primary/70 animate-ping pointer-events-none scale-150" />
              )}

              {/* Glowing Aura for Selected Table */}
              {isSelected && (
                <span className="absolute -inset-3 rounded-full bg-primary/40 blur-lg animate-pulse pointer-events-none" />
              )}

              {/* Interactive Table Button */}
              <motion.button
                type="button"
                onClick={() => handleTableClick(table, isBooked)}
                onMouseEnter={() => setHoveredTableId(table.id)}
                onMouseLeave={() => setHoveredTableId(null)}
                whileHover={
                  !isBooked
                    ? {
                        scale: 1.18,
                        y: -5,
                        boxShadow: "0 0 25px rgba(201,162,39,0.95)",
                        transition: { type: "spring", stiffness: 400, damping: 17 },
                      }
                    : {}
                }
                whileTap={!isBooked ? { scale: 0.92 } : {}}
                animate={
                  isSelected
                    ? {
                        scale: [1, 1.14, 1.08],
                        boxShadow: [
                          "0 0 15px rgba(201,162,39,0.7)",
                          "0 0 35px rgba(201,162,39,1)",
                          "0 0 20px rgba(201,162,39,0.8)",
                        ],
                        transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                      }
                    : {}
                }
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 shadow-2xl cursor-pointer select-none",
                  // Selected state
                  isSelected &&
                    "bg-gradient-to-r from-[#FFF0A0] via-primary to-[#FFE885] text-black font-extrabold ring-4 ring-primary/80 shadow-[0_0_35px_rgba(201,162,39,1)] z-30",
                  // Booked state
                  isBooked &&
                    "bg-red-950/90 text-red-300 border border-red-700/60 opacity-80 cursor-not-allowed",
                  // Available state
                  !isSelected &&
                    !isBooked &&
                    "bg-black/90 text-[#FFE885] border-2 border-primary/80 hover:border-primary hover:bg-black/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                )}
              >
                {/* Visual Icon */}
                {isSelected ? (
                  <span className="size-4 rounded-full bg-black text-[#FFE885] flex items-center justify-center text-[10px] font-black shadow-inner">
                    ✓
                  </span>
                ) : isBooked ? (
                  <Ban className="size-3 text-red-400" />
                ) : (
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-400" />
                  </span>
                )}

                {/* Table Number & ID */}
                <span className="font-mono text-xs font-black tracking-tight">
                  {table.id}
                </span>

                {/* Capacity Badge */}
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5",
                    isSelected
                      ? "bg-black/25 text-black"
                      : isBooked
                      ? "bg-red-900/60 text-red-200"
                      : "bg-white/15 text-white/90"
                  )}
                >
                  <Users className="size-2.5" />
                  <span>{table.capacity}</span>
                </span>
              </motion.button>

              {/* Table Seats Dots Animation around the button */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {Array.from({ length: Math.min(table.capacity, 6) }).map((_, i) => {
                  const angle = (i * 360) / Math.min(table.capacity, 6);
                  const rad = (angle * Math.PI) / 180;
                  const radius = isSelected ? 24 : 20;
                  const cx = Math.cos(rad) * radius;
                  const cy = Math.sin(rad) * radius;
                  return (
                    <span
                      key={i}
                      style={{
                        transform: `translate(${cx}px, ${cy}px)`,
                      }}
                      className={cn(
                        "absolute size-1.5 rounded-full transition-all duration-300",
                        isSelected
                          ? "bg-primary shadow-[0_0_8px_rgba(201,162,39,0.9)]"
                          : isHovered
                          ? "bg-[#FFE885] opacity-90"
                          : "bg-white/40 opacity-50"
                      )}
                    />
                  );
                })}
              </div>

              {/* Interactive Tooltip on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-3.5 rounded-2xl bg-black/95 border-2 border-primary/50 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] z-50 text-right"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-black text-primary">
                          {table.id}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          ({table.nameEn})
                        </span>
                      </div>
                      {isBooked ? (
                        <span className="text-[10px] font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800/60">
                          محجوزة
                        </span>
                      ) : isSelected ? (
                        <span className="text-[10px] font-black text-black bg-primary px-2 py-0.5 rounded-full shadow-sm">
                          محددة لحجزك ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-800/50">
                          متاحة للحجز
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white mb-0.5">
                      {table.nameAr}
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {table.descriptionAr}
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <Users className="size-3" /> تتسع لـ {table.capacity} أشخاص
                      </span>
                      {!isBooked && (
                        <span className="text-[#FFE885] font-bold text-[10px] underline underline-offset-2">
                          {isSelected ? "تم الاختيار" : "انقر للاختيار"}
                        </span>
                      )}
                    </div>

                    {!isBooked && onProceedToBooking && isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProceedToBooking();
                        }}
                        className="mt-2 w-full py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                      >
                        <span>متابعة للخيارات الأخرى</span>
                        <ArrowLeft className="size-3" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ======================================================================= */}
      {/* 4. SELECTED TABLE PROMINENT BANNER WITH QUICK PROCEED CTA */}
      {/* ======================================================================= */}
      <AnimatePresence mode="wait">
        {activeTableObj ? (
          <motion.div
            key={activeTableObj.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border-2 border-primary/70 bg-gradient-to-r from-primary/25 via-black/90 to-primary/15 backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_35px_rgba(201,162,39,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-[#FFF0A0] via-primary to-[#FFE885] text-black flex items-center justify-center font-black text-2xl shadow-xl shrink-0 ring-2 ring-primary/60">
                {activeTableObj.id}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-lg font-bold text-white">
                    {activeTableObj.nameAr}
                  </span>
                  <Badge variant="outline" className="border-primary/50 text-primary text-[11px] font-bold bg-primary/10">
                    {activeTableObj.zoneNameAr}
                  </Badge>
                  <Badge variant="secondary" className="text-[11px] gap-1 bg-white/10 text-white font-medium">
                    <Users className="size-3" /> تتسع لـ {activeTableObj.capacity} أشخاص
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3.5" /> تم تحديد الطاولة بنجاح
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                  {activeTableObj.descriptionAr}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {activeTableObj.featuresAr.map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-primary/15 text-[#FFE885] border border-primary/30"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proceed to other options Button */}
            {onProceedToBooking && (
              <Button
                onClick={onProceedToBooking}
                className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-extrabold px-7 h-12 text-sm shadow-[0_0_25px_rgba(201,162,39,0.5)] shrink-0 gap-2 transition-all hover:scale-[1.02]"
                size="lg"
              >
                <span>الذهاب للخيارات الأخرى (التاريخ والوقت)</span>
                <ChevronLeft className="size-4" />
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 rounded-2xl border border-dashed border-primary/40 bg-black/40 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2.5 shadow-sm"
          >
            <div className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="size-4 animate-pulse" />
            </div>
            <span className="text-foreground/90 font-medium text-sm">
              يرجى النقر على أي طاولة ذهبية في صورة المطعم أعلاه أو من خيارات الطاولات المتعددة أدناه لتحديد موقع جلوسك
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* 5. MULTIPLE TABLE CHOICES SECTION (عدة خيارات للطاولات) */}
      {/* ======================================================================= */}
      <div className="rounded-2xl border border-primary/30 bg-card/40 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="size-4 text-primary" />
              <h3 className="font-serif text-lg font-bold text-foreground">
                خيارات الطاولات المتعددة ({RESTAURANT_TABLES.length} طاولة متاحة)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              تصفح خيارات الطاولات المتنوعة حسب السعة ونوع الجلسة، وانقر لاختيار أي طاولة لتحديدها بالصورة
            </p>
          </div>

          {/* Table Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-border/80 flex-wrap self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setTableFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all",
                tableFilter === "all"
                  ? "bg-primary text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              الكل ({RESTAURANT_TABLES.length})
            </button>
            <button
              type="button"
              onClick={() => setTableFilter("2")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1",
                tableFilter === "2"
                  ? "bg-primary text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>شخصين</span>
            </button>
            <button
              type="button"
              onClick={() => setTableFilter("4")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1",
                tableFilter === "4"
                  ? "bg-primary text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>4 أشخاص</span>
            </button>
            <button
              type="button"
              onClick={() => setTableFilter("vip")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1",
                tableFilter === "vip"
                  ? "bg-primary text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Crown className="size-3" />
              <span>كبار الشخصيات (6-8)</span>
            </button>
            <button
              type="button"
              onClick={() => setTableFilter("booth")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all",
                tableFilter === "booth"
                  ? "bg-primary text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              مقصورات وبوثات
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredAllTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isBooked = bookedTableIds.includes(table.id);

            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table, isBooked)}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between gap-3 text-right cursor-pointer group",
                  isSelected
                    ? "bg-primary/15 border-primary shadow-[0_0_20px_rgba(201,162,39,0.3)] ring-1 ring-primary"
                    : isBooked
                    ? "bg-card/30 border-border/40 opacity-60 cursor-not-allowed"
                    : "bg-card/70 border-border/70 hover:border-primary/60 hover:bg-card/90 hover:shadow-lg"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-mono font-black text-xs px-2.5 py-0.5 rounded-lg",
                          isSelected
                            ? "bg-primary text-black shadow-sm"
                            : "bg-black/60 text-primary border border-primary/30"
                        )}
                      >
                        {table.id}
                      </span>
                      <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                        {table.nameAr}
                      </span>
                    </div>

                    {isBooked ? (
                      <span className="text-[10px] text-red-300 bg-red-950/70 px-2 py-0.5 rounded-full border border-red-800/40">
                        محجوزة
                      </span>
                    ) : isSelected ? (
                      <span className="text-[10px] font-bold text-black bg-primary px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        ✓ محددة
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        متاحة
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {table.descriptionAr}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-primary font-semibold">
                      <Users className="size-3" /> {table.capacity} أشخاص
                    </span>
                    <span className="text-[10px] text-muted-foreground/80">
                      • {table.zoneNameAr}
                    </span>
                  </div>

                  {!isBooked && (
                    <button
                      type="button"
                      className={cn(
                        "text-[11px] font-bold px-3 py-1 rounded-lg transition-all",
                        isSelected
                          ? "bg-primary text-black"
                          : "text-primary hover:bg-primary/10 border border-primary/30"
                      )}
                    >
                      {isSelected ? "تم الاختيار" : "اختيار الطاولة"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
