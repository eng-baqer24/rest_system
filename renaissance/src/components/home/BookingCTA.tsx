"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";

export function BookingCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section ref={ref} className="relative py-16 md:py-24">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-divider-shine" />
      <div className="container px-4 text-center md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl font-semibold text-primary md:text-4xl flex items-center justify-center gap-4"
        >
          <div className="h-px bg-gradient-to-r from-transparent to-primary/60 w-16 md:w-24" />
          Reserve Your Table
          <div className="h-px bg-gradient-to-r from-primary/60 to-transparent w-16 md:w-24" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mx-auto mt-4 max-w-md text-foreground text-lg"
        >
          Reserve your spot for an unforgettable dinner
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <BookingModal>
            <Button
              size="lg"
              className="mt-8 bg-primary/95 hover:bg-primary border border-primary/50 px-12 py-6 text-lg font-medium text-primary-foreground transition-all shadow-[0_0_15px_rgba(198,156,82,0.3)] hover:shadow-[0_0_25px_rgba(198,156,82,0.5)] animate-gold-glow"
            >
              Reserve
            </Button>
          </BookingModal>
        </motion.div>
      </div>
    </section>
  );
}
