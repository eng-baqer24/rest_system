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
import { useReservedTables } from "@/hooks/useReservedTables";
import {
  RestaurantFloorPlan,
  RestaurantTable,
} from "@/components/booking/RestaurantFloorPlan";
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, MapPin } from "lucide-react";

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Step = 1 | 2;

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const minDate = startOfDay(new Date());
  const maxDate = addDays(new Date(), 60);
  const bookedDates = useBookedDates();
  const reservedTableIds = useReservedTables(date, time);

  const handleSelectTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    if (table.capacity) {
      setGuests(table.capacity);
    }
  };

  const handleProceedToStep2 = () => {
    if (selectedTable) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const canProceedStep2 = date && time && name.trim() && email.trim() && phone.trim();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    let finalNotes = notes.trim();
    if (selectedTable) {
      const tableTag = `[Table: ${selectedTable.nameAr} - ${selectedTable.name} (T-${selectedTable.number < 10 ? `0${selectedTable.number}` : selectedTable.number}, ${selectedTable.zoneNameAr}, ${selectedTable.capacity} مقاعد)]`;
      finalNotes = finalNotes ? `${tableTag} - ${finalNotes}` : tableTag;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          time,
          guests,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: finalNotes || undefined,
          tableId: selectedTable?.id,
          tableName: selectedTable
            ? `${selectedTable.nameAr} (T-${selectedTable.number})`
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push(`/booking/confirm?id=${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ ما. يرجى المحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl px-4 py-8 md:px-6">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-primary md:text-5xl">
          Reserve Your Table • حجز طاولة
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground font-arabic" dir="rtl">
          {step === 1
            ? "الخطوة الأولى: اختر طاولتك المفضلة من داخل صورة المطعم مباشرةً"
            : "الخطوة الثانية: حدد تاريخ ووقت الحجز وأدخل بياناتك للتأكيد"}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="mt-6 flex justify-center items-center gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer",
            step === 1
              ? "bg-primary text-black shadow-lg shadow-primary/30"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <span>1</span>
          <span>1. اختيار الطاولة على الصورة (Select Table)</span>
        </button>
        <div className="h-[1px] w-6 bg-border" />
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
            step === 2
              ? "bg-primary text-black shadow-lg shadow-primary/30"
              : "bg-card border border-border text-muted-foreground"
          )}
        >
          <span>2</span>
          <span>2. التاريخ والبيانات (Date & Details)</span>
        </div>
      </div>

      {/* STEP 1: RESTAURANT PHOTO & TABLE SELECTION FIRST */}
      {step === 1 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-primary/30 bg-black/40 p-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <Sparkles className="size-5 text-primary animate-pulse" />
                  <span>صورة صالة المطعم • Restaurant Interior View</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-arabic" dir="rtl">
                  مرّر الماوس فوق الطاولات لمشاهدة تفاصيل كل طاولة وميزتها، ثم انقر على الطاولة التي تناسبك
                </p>
              </div>

              {selectedTable && (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-500/20 px-3.5 py-1 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="size-4" />
                  <span>تم تحديد: {selectedTable.nameAr} (T-{selectedTable.number})</span>
                </div>
              )}
            </div>

            {/* The Interactive Restaurant Photo */}
            <div className="mt-4">
              <RestaurantFloorPlan
                selectedTableId={selectedTable?.id}
                onSelectTable={handleSelectTable}
                guestCount={guests}
                reservedTableIds={reservedTableIds}
              />
            </div>
          </div>

          {/* Action Callout Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-primary/40 bg-card/60 p-4">
            <div className="text-xs sm:text-sm">
              {selectedTable ? (
                <div>
                  <span className="text-muted-foreground">الطاولة المحددة: </span>
                  <strong className="text-primary font-bold text-base">
                    {selectedTable.nameAr} (T-{selectedTable.number})
                  </strong>
                  <span className="text-muted-foreground"> • يتسع لـ {selectedTable.capacity} أشخاص ({selectedTable.zoneNameAr})</span>
                </div>
              ) : (
                <div className="text-amber-400 font-medium">
                  👈 يرجى النقر على أي طاولة داخل صورة المطعم أعلاه للاستمرار
                </div>
              )}
            </div>

            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-6 text-base shadow-[0_0_25px_rgba(201,162,39,0.4)]"
              size="lg"
              disabled={!selectedTable}
              onClick={handleProceedToStep2}
            >
              <span>المتابعة لاختيار التاريخ وباقي التفاصيل</span>
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: CHOOSE DATE, TIME & REMAINING DETAILS */}
      {step === 2 && (
        <div className="mt-8 max-w-3xl mx-auto space-y-6">
          {/* Selected Table Summary Banner */}
          {selectedTable && (
            <div className="rounded-2xl border-2 border-primary bg-gradient-to-r from-primary/20 via-black/80 to-primary/20 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-black font-serif font-black text-2xl shadow-lg shadow-primary/40 border-2 border-white">
                  T-{selectedTable.number < 10 ? `0${selectedTable.number}` : selectedTable.number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-bold text-primary tracking-wider">
                      الطاولة المحجوزة
                    </span>
                    <span className="rounded-md bg-primary/20 border border-primary/40 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {selectedTable.zoneNameAr}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-foreground mt-0.5">
                    {selectedTable.nameAr} ({selectedTable.name})
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Users className="size-3.5 text-primary" /> {selectedTable.capacity} مقاعد
                    </span>
                    <span>•</span>
                    <span className="text-primary font-medium">{selectedTable.perkAr}</span>
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="border-primary/50 text-primary hover:bg-primary/20 self-end sm:self-auto text-xs"
              >
                <ArrowLeft className="size-3.5 mr-1" />
                تغيير الطاولة (Change)
              </Button>
            </div>
          )}

          {/* Date & Time Selection Box */}
          <div className="rounded-2xl border border-primary/30 bg-card/60 p-5 md:p-6 backdrop-blur-md space-y-5">
            <h3 className="font-serif text-lg font-bold text-primary border-b border-border/40 pb-2 flex items-center gap-2">
              <CalendarIcon className="size-5 text-primary" />
              <span>حدد موعد الحجز • Select Date & Time</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Label className="text-foreground text-xs uppercase tracking-wider block mb-2 font-semibold">
                  1. اختر اليوم (Date)
                </Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) =>
                    isBefore(d, minDate) ||
                    d > maxDate ||
                    bookedDates.has(format(d, "yyyy-MM-dd"))
                  }
                  className="rounded-xl border border-border bg-black/50 flex justify-center p-3"
                />
              </div>

              {/* Time & Guests */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <Label className="text-foreground text-xs uppercase tracking-wider block mb-2 font-semibold flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    <span>2. اختر الوقت (Time)</span>
                  </Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="bg-black/50 border-border h-12 text-sm font-medium">
                      <SelectValue placeholder="اختر وقت الحضور المناسب" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground text-xs uppercase tracking-wider block mb-2 font-semibold flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    <span>3. عدد الضيوف (Party Size)</span>
                  </Label>
                  <Select
                    value={String(guests)}
                    onValueChange={(v) => setGuests(Number(v))}
                  >
                    <SelectTrigger className="bg-black/50 border-border h-12 text-sm font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GUEST_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "ضيف واحد (1 Guest)" : `${n} ضيوف (${n} Guests)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    * سعة هذه الطاولة المقترحة هي {selectedTable?.capacity || 4} أشخاص
                  </span>
                </div>

                {date && time && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>
                      الموعد: {format(date, "EEEE, MMMM d")} في تمام الساعة {time}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guest Personal Information Fields */}
          <div className="rounded-2xl border border-primary/30 bg-card/60 p-5 md:p-6 backdrop-blur-md space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary border-b border-border/40 pb-2">
              بيانات التواصل • Guest Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">الاسم الكامل (Full Name) *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد علي / John Doe"
                  className="mt-2 bg-black/50 border-border h-11"
                />
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف (Phone Number) *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 780 123 4567"
                  className="mt-2 bg-black/50 border-border h-11"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني (Email Address) *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="mt-2 bg-black/50 border-border h-11"
              />
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات خاصة (Special Requests - اختياري)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="عيد ميلاد، ذكرى زواج، متطلبات غذائية خاصة..."
                className="mt-2 min-h-[90px] bg-black/50 border-border"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center rounded-xl bg-destructive/10 p-3.5 border border-destructive/20 font-medium">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border h-13 text-sm font-semibold"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="size-4 mr-2" />
              رجوع لاختيار طاولة أخرى
            </Button>

            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-13 font-bold text-base shadow-[0_0_25px_rgba(201,162,39,0.4)]"
              disabled={!canProceedStep2 || loading}
              onClick={handleSubmit}
            >
              {loading ? "جاري المعالجة..." : "تأكيد الحجز النهائي (Confirm Booking)"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

