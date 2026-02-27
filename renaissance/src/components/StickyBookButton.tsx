"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

export function StickyBookButton() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 180], [72, 0]);
  const opacity = useTransform(scrollY, [0, 180], [0, 1]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 md:bottom-8 pointer-events-auto"
    >
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary px-8 py-6 text-base font-medium shadow-lg transition-all hover:bg-primary/90 md:py-6 animate-gold-glow"
        >
          <Link href="/booking">Reserve</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
