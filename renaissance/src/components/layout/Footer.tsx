"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, Phone, Facebook, Instagram, ShieldCheck } from "lucide-react";

const footerLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/menu", label: "القائمة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/booking", label: "حجز طاولة" },
];

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-10 mt-16 border-t border-primary/20 bg-background/50"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container px-4 md:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <MapPin className="size-4 text-primary" />
              <span>شارع الأميرات، المنصور، بغداد</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-primary/30" />
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <Clock className="size-4 text-primary" />
              <span>يومياً: 1:00 م – 12:00 ص</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-primary/30" />
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="size-4 text-primary" />
              <a href="tel:07800000000" dir="ltr">07800000000</a>
            </div>
          </div>

          {/* Social Icons */}
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

        {/* Quick Links and Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border/40 pt-6 text-xs text-muted-foreground gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-primary/70 transition-colors hover:text-primary"
            >
              <ShieldCheck className="size-3" />
              لوحة الإدارة
            </Link>
          </div>

          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} مطعم Renaissance. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
