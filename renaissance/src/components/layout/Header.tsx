"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(0,0,0,0)", "rgba(11,11,11,0.92)"]
  );
  const headerPadding = useTransform(scrollY, [0, 80], ["1rem", "0.75rem"]);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        paddingTop: headerPadding,
      }}
      className="absolute top-0 left-0 right-0 z-50 w-full pt-4 pb-12 transition-colors duration-300"
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-10">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-wide text-primary md:text-2xl transition-colors hover:opacity-90"
        >
          Renaissance
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative group",
                  pathname === item.href ? "text-primary" : "text-foreground/90"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 right-0 h-[1px] bg-primary transition-transform duration-300 origin-left",
                    pathname === item.href
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <BookingModal>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-shadow"
              >
                Reserve
              </Button>
            </motion.div>
          </BookingModal>
        </div>
      </div>
    </motion.header>
  );
}
