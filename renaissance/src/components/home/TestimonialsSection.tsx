"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-16 md:py-24">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-divider-shine" />
      <div className="container px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl font-semibold text-primary text-center md:text-4xl flex items-center justify-center gap-4"
        >
          <div className="h-px bg-gradient-to-r from-transparent to-primary/60 w-16 md:w-24" />
          What Our Guests Say
          <div className="h-px bg-gradient-to-r from-primary/60 to-transparent w-16 md:w-24" />
        </motion.h2>
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 max-w-2xl text-center relative"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute -top-6 right-0 font-serif text-6xl text-primary/30 rotate-180"
          >
            &quot;
          </motion.span>
          <p className="text-xl md:text-2xl text-foreground leading-relaxed font-serif italic">
            An exceptional experience in every way—stunning ambiance and
            unforgettable food.
          </p>
          <motion.footer
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-8 text-lg text-primary/80"
          >
            — Ali Ahmed —
          </motion.footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
