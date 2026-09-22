"use client";

import { useState, useEffect } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBookedDates } from "@/hooks/useBookedDates";
import { useReservedTables } from "@/hooks/useReservedTables";
import {
  RestaurantFloorPlan,
  RestaurantTable,
} from "@/components/booking/RestaurantFloorPlan";
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2, Sparkles } from "lucide-react";


const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "19:00",
  "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Step = 1 | 2;

interface BookingModalProps {
  children: React.ReactNode;
}

export function BookingModal({ children }: BookingModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  const minDate = startOfDay(new Date());
  const maxDate = addDays(new Date(), 60);
  const bookedDates = useBookedDates();
  const reservedTableIds = useReservedTables(date, time);

  const canProceedStep1 = date && time && guests;
  const canProceedStep2 = name.trim() && email.trim() && phone.trim();

  const handleSelectTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    if (table.capacity) {
      setGuests(table.capacity);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setDate(undefined);
        setTime("");
        setGuests(2);
        setSelectedTable(null);
        setName("");
        setEmail("");
        setPhone("");
        setNotes("");
        setError("");
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    let finalNotes = notes.trim();
    if (selectedTable) {
      const tableTag = `[Table: ${selectedTable.name} (T-${selectedTable.number < 10 ? `0${selectedTable.number}` : selectedTable.number}, ${selectedTable.zoneName}, ${selectedTable.capacity} Guests)]`;
      finalNotes = finalNotes ? `${tableTag} - ${finalNotes}` : tableTag;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date!.toISOString().split("T")[0],
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

      setOpen(false);
      router.push(`/booking/confirm?id=${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto border-border/40 bg-[#0E0E0E]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
            Reserve a Table • حجز طاولة في رينيسانس
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs sm:text-sm">
            {step === 1
              ? "Choose date, time and pick your table from the restaurant map"
              : "Enter your contact details to confirm your reservation"}
          </DialogDescription>
        </DialogHeader>

        {/* Step progress pills */}
        <div className="mt-2 flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer",
              step === 1 ? "bg-primary text-black shadow-md shadow-primary/30" : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <span>1</span>
            <span>1. اختيار الطاولة على الصورة</span>
          </button>
          <span className="text-muted-foreground text-xs">→</span>
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold transition-all",
              step === 2 ? "bg-primary text-black shadow-md shadow-primary/30" : "bg-muted text-muted-foreground"
            )}
          >
            <span>2</span>
            <span>2. الموعد والتفاصيل</span>
          </span>
        </div>

        <div className="mt-4">
          <AnimatePresence mode="wait" initial={false}>
            {/* STEP 1: CHOOSE TABLE ON PHOTO ONLY */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-primary/20 pb-2">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-primary flex items-center gap-1.5">
                      <Sparkles className="size-4 text-primary animate-pulse" />
                      <span>اختر طاولتك المفضلة داخل صورة صالة المطعم</span>
                    </h3>
                    <p className="text-xs text-muted-foreground font-arabic" dir="rtl">
                      مرّر الماوس فوق الطاولات لمشاهدة الميزات وانقر على أي طاولة ترغب بحجزها
                    </p>
                  </div>
                  {selectedTable && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/40 px-3 py-1 rounded-full">
                      <CheckCircle2 className="size-3.5" />
                      {selectedTable.nameAr} (T-{selectedTable.number})
                    </span>
                  )}
                </div>

                {/* Real Photo Restaurant Table Selector */}
                <RestaurantFloorPlan
                  selectedTableId={selectedTable?.id}
                  onSelectTable={handleSelectTable}
                  guestCount={guests}
                  reservedTableIds={reservedTableIds}
                />

                {/* Continue Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40">
                  <div className="text-xs">
                    {selectedTable ? (
                      <span className="text-primary font-bold">
                        ✓ تم اختيار: {selectedTable.nameAr} ({selectedTable.capacity} مقاعد)
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium">
                        👈 انقر على أي طاولة متاحة في الصورة أعلاه للاستمرار
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full sm:w-auto min-w-[220px] bg-primary text-primary-foreground hover:bg-primary/90 py-5 font-bold text-sm shadow-[0_0_20px_rgba(201,162,39,0.4)]"
                    size="lg"
                    disabled={!selectedTable}
                    onClick={() => setStep(2)}
                  >
                    <span>المتابعة لاختيار التاريخ والتفاصيل</span>
                    <span className="ml-1 text-base">→</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHOOSE DATE, TIME & PERSONAL DETAILS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                className="space-y-4 max-w-xl mx-auto"
              >
                {/* Summary badge of the chosen table */}
                {selectedTable && (
                  <div className="rounded-xl border-2 border-primary/60 bg-gradient-to-r from-primary/20 via-black/80 to-primary/20 p-3.5 text-xs shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-black font-bold font-serif text-base border border-white">
                        T-{selectedTable.number}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                          الطاولة المختارة لحجزك
                        </span>
                        <h4 className="font-serif font-bold text-sm text-foreground">
                          {selectedTable.nameAr} ({selectedTable.name})
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedTable.zoneNameAr} • يتسع لـ {selectedTable.capacity} أشخاص
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs text-primary border-primary/40 hover:bg-primary/20 h-8 px-2.5"
                    >
                      تغيير الطاولة
                    </Button>
                  </div>
                )}

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-primary/30 bg-black/50 p-3.5">
                  <div>
                    <Label className="text-foreground text-xs font-semibold flex items-center gap-1.5">
                      <CalendarIcon className="size-3.5 text-primary" />
                      <span>اختر اليوم (Date) *</span>
                    </Label>
                    <Input
                      type="date"
                      min={format(minDate, "yyyy-MM-dd")}
                      max={format(maxDate, "yyyy-MM-dd")}
                      value={date ? format(date, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          setDate(new Date(e.target.value));
                        }
                      }}
                      className="mt-1.5 bg-card/60 border-border h-10 text-xs sm:text-sm font-sans"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary" />
                      <span>اختر الوقت (Time) *</span>
                    </Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="mt-1.5 bg-card/60 border-border h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="اختر وقت الحضور" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <Label className="text-foreground text-xs font-semibold flex items-center gap-1.5">
                      <Users className="size-3.5 text-primary" />
                      <span>عدد الضيوف (Guests)</span>
                    </Label>
                    <Select
                      value={String(guests)}
                      onValueChange={(v) => setGuests(Number(v))}
                    >
                      <SelectTrigger className="mt-1.5 bg-card/60 border-border h-10 text-xs sm:text-sm">
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
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="modal-name">الاسم الكامل (Full Name) *</Label>
                    <Input
                      id="modal-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="محمد علي / John Doe"
                      className="mt-1.5 bg-card/50 border-border h-10 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="modal-phone">رقم الهاتف (Phone) *</Label>
                      <Input
                        id="modal-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+964 780 123 4567"
                        className="mt-1.5 bg-card/50 border-border h-10 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="modal-email">البريد الإلكتروني (Email) *</Label>
                      <Input
                        id="modal-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="mt-1.5 bg-card/50 border-border h-10 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="modal-notes">ملاحظات خاصة (Special Requests - اختياري)</Label>
                    <Textarea
                      id="modal-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="عيد ميلاد، ذكرى زواج، متطلبات غذائية خاصة..."
                      className="mt-1.5 max-h-[70px] bg-card/50 border-border text-xs"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-destructive text-center p-2 rounded-lg bg-destructive/10 border border-destructive/20 font-medium">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-border bg-transparent text-foreground hover:bg-muted"
                    onClick={() => setStep(1)}
                  >
                    رجوع لاختيار طاولة أخرى
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                    disabled={!canProceedStep2 || loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "جاري التأكيد..." : "تأكيد الحجز (Confirm Booking)"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

