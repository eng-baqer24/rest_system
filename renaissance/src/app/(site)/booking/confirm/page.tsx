"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 md:px-6">
      <div className="max-w-md text-center">
        <CheckCircle className="mx-auto size-16 text-primary" />
        <h1 className="mt-6 font-serif text-2xl font-semibold text-primary md:text-3xl">
          Reservation Received
        </h1>
        <p className="mt-3 text-muted-foreground">
          We will contact you shortly to confirm. Reference:{" "}
          <span className="font-mono text-foreground">{id || "—"}</span>
        </p>
        <Button
          asChild
          className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default function BookingConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-[60vh] items-center justify-center px-4 py-16">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
