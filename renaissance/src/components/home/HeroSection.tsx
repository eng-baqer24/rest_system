"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative -mt-28 flex min-h-[90vh] items-center justify-center overflow-hidden pt-28">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
            alt="Luxury restaurant interior"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
        <motion.div
          className="flex w-full flex-col items-center justify-center text-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={item}
            className="font-serif text-4xl font-semibold tracking-wide text-foreground md:text-6xl lg:text-[4.5rem]"
          >
            An Unforgettable Fine Dining Experience
          </motion.h1>
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-lg text-primary md:text-2xl font-serif"
          >
            Welcome to a world of refined taste.
          </motion.p>
          <motion.div variants={item}>
            <BookingModal>
              <Button
                size="lg"
                className="mt-10 bg-primary/90 border border-primary/50 px-10 py-6 text-lg font-medium text-primary-foreground transition-all shadow-[0_0_15px_rgba(198,156,82,0.4)] hover:shadow-[0_0_25px_rgba(198,156,82,0.6)] hover:bg-primary animate-gold-glow"
              >
                Book a Table
              </Button>
            </BookingModal>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
