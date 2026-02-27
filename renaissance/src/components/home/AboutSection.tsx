"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const textVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section ref={ref} className="relative py-16 md:py-24">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-divider-shine" />
      <div className="container grid gap-12 px-4 md:grid-cols-2 md:px-6 md:gap-16 items-center">
        <div className="flex flex-col justify-center text-center py-8">
          <motion.h2
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-serif text-3xl font-semibold text-primary md:text-4xl"
          >
            About Us
          </motion.h2>
          <motion.div
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mt-4 mb-6"
          />
          <motion.p
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-muted-foreground leading-relaxed text-lg"
          >
            Our journey in the world of taste and the art of our master chef.
          </motion.p>
          <motion.div
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Button
              asChild
              variant="outline"
              className="mt-8 mx-auto w-fit border-primary bg-primary bg-opacity-10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Link href="/about">Discover More</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80"
            alt="Chef preparing a signature dish"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
