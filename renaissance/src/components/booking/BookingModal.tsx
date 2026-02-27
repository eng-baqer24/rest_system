"use client";

import { useState } from "react";
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

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "19:00",
  "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Step = 1 | 2 | 3;

interface BookingModalProps {
  children: React.ReactNode;
}

export function BookingModal({ children }: BookingModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
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

  const canProceedStep1 = date && time && guests;
  const canProceedStep2 = name.trim() && email.trim() && phone.trim();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setDate(undefined);
        setTime("");
        setGuests(2);
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
          notes: notes.trim() || undefined,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border/40 bg-card p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-semibold text-primary text-center">
            Reserve a Table
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {step === 1 ? "Choose date, time and number of guests" : "Enter your details to confirm"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-center gap-2">
          {([1, 2] as Step[]).map((s) => (
            <div
              key={s}
              className={cn(
                "size-2 rounded-full transition-colors",
                step === s ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-foreground">Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) =>
                      isBefore(d, minDate) ||
                      d > maxDate ||
                      bookedDates.has(format(d, "yyyy-MM-dd"))
                    }
                    className="mt-2 rounded-md border border-border bg-card/50 flex justify-center w-full"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="mt-2 bg-card/50 border-border">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-foreground">Guests</Label>
                  <Select
                    value={String(guests)}
                    onValueChange={(v) => setGuests(Number(v))}
                  >
                    <SelectTrigger className="mt-2 bg-card/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GUEST_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="modal-name">Name</Label>
                <Input
                  id="modal-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="mt-2 bg-card/50 border-border"
                />
              </div>
              <div>
                <Label htmlFor="modal-email">Email</Label>
                <Input
                  id="modal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="mt-2 bg-card/50 border-border"
                />
              </div>
              <div>
                <Label htmlFor="modal-phone">Phone</Label>
                <Input
                  id="modal-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="mt-2 bg-card/50 border-border"
                />
              </div>
              <div>
                <Label htmlFor="modal-notes">Notes (optional)</Label>
                <Textarea
                  id="modal-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special occasion, dietary requirements..."
                  className="mt-2 max-h-[100px] bg-card/50 border-border"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border bg-transparent text-foreground hover:bg-muted"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!canProceedStep2 || loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Booking..." : "Confirm Booking"}
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
