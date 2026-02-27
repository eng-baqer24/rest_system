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

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Step = 1 | 2 | 3;

export default function BookingPage() {
  const router = useRouter();
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
      router.push(`/booking/confirm?id=${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-3xl font-semibold text-primary text-center md:text-4xl">
        Book a Table
      </h1>
      <p className="mt-2 text-center text-muted-foreground">
        Choose date, time and number of guests
      </p>

      <div className="mt-8 flex justify-center gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <div
            key={s}
            className={cn(
              "size-3 rounded-full transition-colors",
              step === s ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="mt-10 space-y-8">
          <div>
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
              className="mt-2 rounded-md border border-border bg-card"
            />
          </div>
          <div>
            <Label className="text-foreground">Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="mt-2 bg-card">
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
            <Label className="text-foreground">Number of guests</Label>
            <Select
              value={String(guests)}
              onValueChange={(v) => setGuests(Number(v))}
            >
              <SelectTrigger className="mt-2 bg-card">
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
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
            disabled={!canProceedStep1}
            onClick={() => setStep(2)}
          >
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-10 space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="mt-2 bg-card"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="mt-2 bg-card"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="mt-2 bg-card"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special occasion, dietary requirements, outdoor seating..."
              className="mt-2 min-h-[100px] bg-card"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              disabled={!canProceedStep2 || loading}
              onClick={handleSubmit}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
