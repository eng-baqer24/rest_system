"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, Phone, Facebook, Instagram, Lock, Sparkles } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Reservations" },
];

export function Footer() {
  const pathname = usePathname();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/login")) {
    return null;
  }

  const handleReplayIntro = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname !== "/") {
        window.location.href = "/?intro=true";
      } else {
        window.dispatchEvent(new CustomEvent("replay-restaurant-intro"));
      }
    }
  };

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-8 mt-12"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container px-4 md:px-6 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {/* Replay Intro button */}
          <button
            type="button"
            onClick={handleReplayIntro}
            className="transition-colors hover:text-amber-300 text-muted-foreground/70 flex items-center gap-1.5 text-xs hover:border-amber-400/40 border border-transparent rounded-full px-2.5 py-0.5 bg-black/20"
            title="مشاهدة انميشن الترحيب الفاخر مجدداً"
          >
            <Sparkles className="size-3 text-amber-400" />
            <span>مشاهدة الترحيب مجدداً</span>
          </button>
          {/* Discrete Admin Link */}
          <Link
            href="/login"
            className="transition-colors hover:text-primary text-muted-foreground/60 flex items-center gap-1 text-xs"
            title="تسجيل دخول مالك المطعم"
          >
            <Lock className="size-3" />
            <span>بوابة الإدارة</span>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/30 pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <MapPin className="size-5 text-primary" />
              <span>Golden Avenue, Baghdad</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-primary/30" />
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <Clock className="size-5 text-primary" />
              <span>Open 5:00 PM – 11:00 PM</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-primary/30" />
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="size-5 text-primary" />
              <a href="tel:01234567889" dir="ltr">01234567889</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Facebook"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              <Facebook className="size-5" />
            </motion.a>
            <motion.a
              href="#"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Instagram"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="size-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
