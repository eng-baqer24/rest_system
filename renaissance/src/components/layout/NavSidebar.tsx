"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function NavSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* زر في الهيدر للموبايل العمودي فقط */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex md:hidden",
          "items-center justify-center w-10 h-10 rounded-full",
          "bg-primary/20 text-primary border border-primary/40",
          "hover:bg-primary/30 hover:border-primary/60 transition-colors"
        )}
        aria-label="فتح القائمة"
      >
        <Menu className="size-5" />
      </button>
      {/* أيقونة ثابتة على جانب الصفحة في الوضع الأفقي (md فما فوق) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40",
          "items-center justify-center w-12 h-12 rounded-full",
          "bg-primary/20 text-primary border border-primary/40",
          "hover:bg-primary/30 hover:border-primary/60 transition-colors",
          "shadow-lg shadow-black/30"
        )}
        aria-label="فتح القائمة"
      >
        <Menu className="size-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 md:bg-black/40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-card border-r border-border shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-serif text-lg font-semibold text-primary">
                  Renaissance
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="إغلاق القائمة"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/20 text-primary"
                        : "text-foreground/90 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
