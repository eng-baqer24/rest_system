"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBookedDates } from "@/hooks/useBookedDates";
import { useTableAvailability } from "@/hooks/useTableAvailability";
import { VisualPhotoFloorPlan } from "@/components/booking/VisualPhotoFloorPlan";
import { InteractiveFloorPlan } from "@/components/booking/InteractiveFloorPlan";
import { RestaurantTable, RESTAURANT_TABLES } from "@/data/restaurantTables";
import {
  CalendarDays,
  Clock,
  Users,
  Compass,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  Image as ImageIcon,
  LayoutGrid,
} from "lucide-react";

const TIME_SLOTS = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Step = 1 | 2 | 3;

export default function BookingPage() {
  const router = useRouter();

  // Step 1: Select Table from Restaurant Photo (Default first view)
  // Step 2: Date, Time & Number of Guests
  // Step 3: Customer Information & Final Confirmation
  const [step, setStep] = useState<Step>(1);

  // Table Selection State (initially null so customer clicks directly on the restaurant photo)
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);

  // Step 1 View Mode: "photo" (default realistic picture) or "blueprint" (schematic layout)
  const [viewStyle, setViewStyle] = useState<"photo" | "blueprint">("photo");

  // Date, Time & Guests State
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("20:00");
  const [guests, setGuests] = useState<number>(2);

  // Customer Contact State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const minDate = startOfDay(new Date());
  const maxDate = addDays(new Date(), 60);
  const bookedDates = useBookedDates();

  const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;

  // Real-time Supabase table availability for selected date & time
  const { bookedTables, isLoading: isLoadingTables } = useTableAvailability(
    formattedDate,
    time
  );

  const isTableCurrentlyBooked =
    selectedTable !== null && bookedTables.includes(selectedTable.id);

  const canProceedStep1 = selectedTable !== null && !isTableCurrentlyBooked;
  const canProceedStep2 = date && time && guests > 0 && selectedTable !== null;
  const canProceedStep3 = name.trim() && phone.trim() && selectedTable;

  const handleSelectTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    // Automatically match guests count if table is smaller
    if (table.capacity < guests) {
      setGuests(table.capacity);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTable) {
      setError("يرجى اختيار الطاولة أولاً");
      return;
    }
    if (!date || !time) {
      setError("يرجى اختيار التاريخ والوقت المناسب");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          time,
          guests,
          table_number: selectedTable.id,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل إتمام الحجز. يرجى المحاولة مرة أخرى.");
      }

      router.push(
        `/booking/confirm?id=${data.id}&table=${selectedTable.id}&date=${formattedDate}&time=${time}&guests=${guests}`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع. يُرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl px-4 py-8 md:px-6" dir="rtl">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-3">
          <Sparkles className="size-3.5" />
          <span>حجز الطاولات المرئي التفاعلي</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          اختر طاولتك من صورة المطعم
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          انقر مباشرة على أي طاولة في صورة الصالة لاختيار موقع جلوسك، ثم تابع لتحديد موعد الزيارة وتأكيد حجزك في Supabase.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {/* Step 1: Table on Photo */}
          <div
            onClick={() => setStep(1)}
            className={cn(
              "cursor-pointer p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5",
              step === 1
                ? "bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(201,162,39,0.2)]"
                : "bg-card/60 border-primary/40 text-foreground"
            )}
          >
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-bold",
                step === 1
                  ? "bg-primary text-black"
                  : selectedTable
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {selectedTable && step !== 1 ? "✓" : "1"}
            </div>
            <span className="text-xs font-semibold">اختيار الطاولة بالصورة</span>
          </div>

          {/* Step 2: Date & Time */}
          <div
            onClick={() => selectedTable && setStep(2)}
            className={cn(
              "p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5",
              selectedTable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
              step === 2
                ? "bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(201,162,39,0.2)]"
                : step > 2
                ? "bg-card/60 border-primary/40 text-foreground"
                : "bg-card/40 border-border text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-bold",
                step === 2
                  ? "bg-primary text-black"
                  : step > 2
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > 2 ? "✓" : "2"}
            </div>
            <span className="text-xs font-semibold">الموعد والتوقيت</span>
          </div>

          {/* Step 3: Customer Info */}
          <div
            onClick={() => canProceedStep2 && setStep(3)}
            className={cn(
              "p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5",
              canProceedStep2 ? "cursor-pointer" : "cursor-not-allowed opacity-50",
              step === 3
                ? "bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(201,162,39,0.2)]"
                : "bg-card/40 border-border text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-bold",
                step === 3 ? "bg-primary text-black" : "bg-muted text-muted-foreground"
              )}
            >
              3
            </div>
            <span className="text-xs font-semibold">بيانات الحجز</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP 1: INTERACTIVE RESTAURANT PHOTO FLOOR PLAN (FIRST VIEW) */}
      {/* ============================================================== */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* View toggle (Photo vs Schematic Blueprint) */}
          <div className="flex items-center justify-end gap-2 pb-1">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              طريقة العرض:
            </span>
            <div className="inline-flex rounded-lg bg-card border border-border p-1">
              <button
                type="button"
                onClick={() => setViewStyle("photo")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                  viewStyle === "photo"
                    ? "bg-primary text-black font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ImageIcon className="size-3.5" />
                <span>صورة المطعم الواقعية</span>
              </button>
              <button
                type="button"
                onClick={() => setViewStyle("blueprint")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                  viewStyle === "blueprint"
                    ? "bg-primary text-black font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Compass className="size-3.5" />
                <span>المخطط الهندسي</span>
              </button>
            </div>
          </div>

          {/* Render Active View Style */}
          {viewStyle === "photo" ? (
            <VisualPhotoFloorPlan
              selectedTableId={selectedTable?.id}
              onSelectTable={handleSelectTable}
              onProceedToBooking={() => setStep(2)}
              bookedTableIds={bookedTables}
              guestsCount={guests}
              isLoadingAvailability={isLoadingTables}
            />
          ) : (
            <InteractiveFloorPlan
              selectedTableId={selectedTable?.id}
              onSelectTable={handleSelectTable}
              bookedTableIds={bookedTables}
              guestsCount={guests}
              isLoadingAvailability={isLoadingTables}
              selectedDate={formattedDate}
              selectedTime={time}
            />
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              {selectedTable ? (
                <span className="text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  تم اختيار: <strong className="text-primary">{selectedTable.nameAr} ({selectedTable.id})</strong>
                  <span>• السعة: {selectedTable.capacity} أشخاص</span>
                </span>
              ) : (
                <span className="text-amber-400">* يرجى النقر على إحدى الطاولات في الصورة</span>
              )}
            </div>

            <Button
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 h-12 shadow-[0_0_20px_rgba(201,162,39,0.3)] gap-2"
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
            >
              <span>متابعة لتحديد الموعد والوقت</span>
              <ArrowLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2: DATE, TIME & GUEST OPTIONS */}
      {/* ============================================================== */}
      {step === 2 && selectedTable && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Pinned Table Summary Badge */}
          <div className="p-4 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card/90 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-lg bg-primary text-black font-bold text-base flex items-center justify-center shadow-md">
                {selectedTable.id}
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">
                  {selectedTable.nameAr}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="size-3 text-primary" />
                  <span>{selectedTable.zoneNameAr}</span>
                  <span>•</span>
                  <span>السعة القصوى: {selectedTable.capacity} ضيوف</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
              className="text-xs border-primary/40 h-8 hover:bg-primary/10"
            >
              تغيير الطاولة بالصورة
            </Button>
          </div>

          {/* Date, Time & Guests Card */}
          <div className="rounded-2xl border border-primary/30 bg-[#121215]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="size-4 text-primary" />
                <Label className="text-foreground text-sm font-semibold">
                  اختر تاريخ الزيارة
                </Label>
              </div>
              <div className="flex justify-center p-2 rounded-xl border border-border/80 bg-black/40">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) =>
                    isBefore(d, minDate) ||
                    d > maxDate ||
                    bookedDates.has(format(d, "yyyy-MM-dd"))
                  }
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-4 text-primary" />
                  <Label className="text-foreground text-sm font-semibold">
                    وقت الحضور
                  </Label>
                </div>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full bg-card/80 border-border/80 h-11 text-right">
                    <SelectValue placeholder="اختر التوقيت" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t} {Number(t.split(":")[0]) >= 18 ? "(مساءً)" : "(ظهراً)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="size-4 text-primary" />
                  <Label className="text-foreground text-sm font-semibold">
                    عدد الضيوف
                  </Label>
                </div>
                <Select
                  value={String(guests)}
                  onValueChange={(v) => setGuests(Number(v))}
                >
                  <SelectTrigger className="w-full bg-card/80 border-border/80 h-11 text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GUEST_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "ضيف واحد" : n === 2 ? "ضيفان" : "ضيوف"}
                        {n > selectedTable.capacity ? " (أكبر من سعة الطاولة)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Supabase conflict alert if table is booked for this date & time */}
            {isTableCurrentlyBooked && (
              <div className="p-3.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs leading-relaxed flex items-center gap-2">
                <span>
                  عذراً، الطاولة <strong>({selectedTable.id})</strong> محجوزة مسبقاً في هذا التاريخ والوقت. يُرجى اختيار موعد آخر أو تغيير الطاولة.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="text-xs h-7 mr-auto shrink-0 border-destructive/40"
                >
                  اختر طاولة أخرى
                </Button>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto border-border hover:bg-card h-12"
              >
                <ArrowRight className="size-4 ml-2" />
                <span>رجوع لصورة المطعم</span>
              </Button>

              <Button
                className="w-full sm:flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 text-sm shadow-[0_0_20px_rgba(201,162,39,0.3)]"
                disabled={!canProceedStep2 || isTableCurrentlyBooked}
                onClick={() => setStep(3)}
              >
                <span>متابعة لبيانات الحجز والتأكيد</span>
                <ArrowLeft className="size-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: CUSTOMER DETAILS & FINAL CONFIRMATION */}
      {/* ============================================================== */}
      {step === 3 && selectedTable && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Reservation Summary Voucher */}
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card/80 to-card/50 backdrop-blur-xl p-5 shadow-xl text-right">
            <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                ملخص حجز الطاولة المحددة
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(2)}
                  className="text-xs h-7 text-primary hover:text-primary hover:bg-primary/10"
                >
                  تعديل الموعد
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="text-xs h-7 text-muted-foreground hover:text-foreground"
                >
                  تغيير الطاولة
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
                  {selectedTable.id}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-base">
                    {selectedTable.nameAr}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="size-3 text-primary" />
                    <span>{selectedTable.zoneNameAr}</span>
                    <span>•</span>
                    <span>السعة: {selectedTable.capacity} أشخاص</span>
                  </div>
                </div>
              </div>

              <div className="text-left text-xs space-y-1">
                <div className="text-foreground font-semibold">{formattedDate}</div>
                <div className="text-primary font-bold text-sm">{time}</div>
                <div className="text-muted-foreground">{guests} ضيوف</div>
              </div>
            </div>
          </div>

          {/* Customer Input Form */}
          <div className="rounded-2xl border border-border/80 bg-[#121215]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-5">
            <h2 className="text-lg font-semibold text-foreground border-b border-border/50 pb-3">
              بيانات التواصل الخاصة بالضيف
            </h2>

            <div>
              <Label htmlFor="name" className="text-foreground text-xs font-medium">
                الاسم الكامل <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد عبد الله"
                className="mt-1.5 bg-card/80 border-border/80 h-11 text-right"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-foreground text-xs font-medium">
                  رقم الهاتف للتأكيد <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 770 000 0000"
                  className="mt-1.5 bg-card/80 border-border/80 h-11 text-right"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground text-xs font-medium">
                  البريد الإلكتروني (اختياري)
                </Label>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1.5 bg-card/80 border-border/80 h-11 text-right"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-foreground text-xs font-medium">
                ملاحظات أو مناسبة خاصة (اختياري)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: ذكرى سنوية، طلب تجهيز زهور، حمية غذائية معينة..."
                className="mt-1.5 min-h-[90px] bg-card/80 border-border/80 text-right leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs leading-relaxed">
                {error}
              </div>
            )}

            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto border-border hover:bg-card h-12"
              >
                <ArrowRight className="size-4 ml-2" />
                <span>العودة للموعد</span>
              </Button>

              <Button
                className="w-full sm:flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 text-base shadow-[0_0_25px_rgba(201,162,39,0.35)]"
                disabled={!canProceedStep3 || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    جاري تثبيت الطاولة وتأكيد الحجز...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-5" />
                    <span>تأكيد حجز الطاولة ({selectedTable.id}) الآن</span>
                  </span>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/70 pt-2 border-t border-border/40">
              <ShieldCheck className="size-3.5 text-primary/70" />
              <span>يتم تثبيت الطاولة مباشرة في نظام الحجوزات السحابي عبر Supabase</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
