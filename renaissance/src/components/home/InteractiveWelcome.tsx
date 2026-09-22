"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  Eye,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";
import { cn } from "@/lib/utils";

export function InteractiveWelcome() {
  const [isOpen, setIsOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user already dismissed it in this session
    const seen = sessionStorage.getItem("renaissance_welcome_seen");
    if (seen === "true") {
      setIsOpen(false);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 30; // Tilt angle
    const y = ((clientY - top) / height - 0.5) * 30;
    setMousePos({ x, y });
  };

  const handleEnter = () => {
    sessionStorage.setItem("renaissance_welcome_seen", "true");
    setIsOpen(false);
  };

  const handleReopen = () => {
    setIsOpen(true);
  };

  if (!isClient) return null;

  return (
    <>
      {/* Small Re-open Trigger Button (Always available in bottom left corner if closed) */}
      {!isOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReopen}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-amber-400/50 bg-black/80 px-4 py-2 text-xs font-serif font-bold text-amber-300 shadow-2xl backdrop-blur-md transition-all hover:bg-amber-400 hover:text-black cursor-pointer"
        >
          <Sparkles className="size-3.5 animate-pulse text-amber-400" />
          <span>الواجهة الترحيبية • Welcome</span>
        </motion.button>
      )}

      {/* Full-Screen Interactive Welcome Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080808] overflow-hidden select-none"
          >
            {/* 1. Dynamic Interactive Background with Mouse-following Golden Spotlight */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
              style={{
                background: `radial-gradient(800px circle at ${50 + mousePos.x * 0.8}% ${
                  50 + mousePos.y * 0.8
                }%, rgba(201, 162, 39, 0.18), transparent 70%)`,
              }}
            />

            {/* Subtle Restaurant Interior Ambiance Silhouette */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 scale-105 bg-cover bg-center filter blur-[3px]"
              style={{ backgroundImage: "url('/restaurant-interior.jpg')" }}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/90" />

            {/* 2. Floating Golden Light Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    opacity: 0.2 + Math.random() * 0.6,
                    scale: 0.5 + Math.random() * 0.8,
                  }}
                  animate={{
                    y: ["0vh", "100vh"],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 12 + Math.random() * 15,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 5,
                  }}
                  className="absolute size-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                />
              ))}
            </div>

            {/* 3. Central Interactive Card with 3D Tilt */}
            <motion.div
              style={{
                transform: `perspective(1000px) rotateX(${-mousePos.y * 0.6}deg) rotateY(${
                  mousePos.x * 0.6
                }deg)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6 py-10 sm:py-14 rounded-3xl border-2 border-amber-400/40 bg-black/75 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_40px_rgba(201,162,39,0.15)] ring-1 ring-white/10 mx-4"
            >
              {/* Royal Emblem Monogram */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative flex items-center justify-center size-20 sm:size-24 rounded-full border-2 border-amber-400/80 bg-gradient-to-br from-amber-400/20 via-black to-amber-500/30 shadow-[0_0_35px_rgba(201,162,39,0.5)] mb-6 group"
              >
                <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/40 animate-spin-slow" />
                <Crown className="size-8 sm:size-10 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-transform duration-300 group-hover:scale-110" />
                <span className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-serif font-black tracking-widest uppercase shadow-md">
                  EST. 2026
                </span>
              </motion.div>

              {/* Welcoming Arabic Header */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="space-y-1.5"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold text-amber-300">
                  <Sparkles className="size-3.5 text-amber-400" />
                  <span>أهلاً وسهلاً بكم في صرح الضيافة الملكية</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-[0_0_20px_rgba(201,162,39,0.4)] pt-2 uppercase">
                  Renaissance
                </h1>
                <p className="text-sm sm:text-base font-serif tracking-widest text-amber-200/80 uppercase">
                  Fine Dining & Luxury Lounge
                </p>
              </motion.div>

              {/* Welcoming Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-4 text-xs sm:text-sm text-zinc-300 max-w-md font-arabic leading-relaxed"
                dir="rtl"
              >
                مرحباً بكم في عالم المذاق الرفيع والأجواء الساحرة. تفضلوا بالدخول لاستكشاف قائمتنا الاستثنائية واختيار طاولتكم المفضلة.
              </motion.p>

              {/* Interactive Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
              >
                {/* Main Enter Button */}
                <Button
                  type="button"
                  size="lg"
                  onClick={handleEnter}
                  className="w-full sm:w-auto min-w-[200px] h-13 bg-amber-400 text-black hover:bg-amber-300 font-serif font-black text-sm tracking-wide shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all hover:scale-105 cursor-pointer border-2 border-white/80"
                >
                  <UtensilsCrossed className="size-4 mr-2" />
                  <span>ادخل إلى المطعم (Enter)</span>
                  <ArrowRight className="size-4 ml-2" />
                </Button>

                {/* Direct Table Reservation Button */}
                <BookingModal>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      sessionStorage.setItem("renaissance_welcome_seen", "true");
                      setIsOpen(false);
                    }}
                    className="w-full sm:w-auto min-w-[190px] h-13 border-2 border-amber-400/70 bg-black/60 text-amber-300 hover:bg-amber-400/20 font-serif font-bold text-sm tracking-wide shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <Eye className="size-4 mr-2 text-amber-400" />
                    <span>احجز طاولتك الآن</span>
                  </Button>
                </BookingModal>
              </motion.div>

              {/* Bottom Interactive Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-8 flex items-center gap-2 text-[11px] text-zinc-400"
              >
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>المطعم مفتوح الآن ويستقبل الحجوزات • Open & Welcoming Guests</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
