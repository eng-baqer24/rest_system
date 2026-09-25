"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Utensils, X } from "lucide-react";

interface IntroSplashScreenProps {
  /**
   * Duration in milliseconds before smooth fade-out starts.
   * Default: 2000ms (2 seconds)
   */
  duration?: number;
}

export function IntroSplashScreen({
  duration = 2000,
}: IntroSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show splash screen with Zoom-In entrance every time the site is opened
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }, 10);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, [duration]);

  // Support custom event to replay intro anytime
  useEffect(() => {
    const handleReplay = () => {
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "";
      }, duration);
    };

    window.addEventListener("replay-restaurant-intro", handleReplay);
    return () => {
      window.removeEventListener("replay-restaurant-intro", handleReplay);
    };
  }, [duration]);

  const handleSkip = () => {
    document.body.style.overflow = "";
    setIsVisible(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="restaurant-splash-screen"
          // Zoom In entrance instead of Fade-in
          initial={{ scale: 0.25, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          // Pure Smooth Fade-out upon finish
          exit={{
            opacity: 0,
            transition: {
              duration: 0.7,
              ease: "easeInOut",
            },
          }}
          transition={{
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1], // Smooth luxury deceleration curve
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#070707] select-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 45%, #18140E 0%, #0B0A08 50%, #050505 100%)",
          }}
        >
          {/* Subtle Golden Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ scale: 0.2, opacity: 0.2 }}
              animate={{ scale: 1.1, opacity: [0.2, 0.45, 0.3] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-amber-500/10 via-amber-300/15 to-transparent blur-[120px]"
            />
            {/* Fine luxury dust dots */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>

          {/* Quick Skip Button */}
          <motion.button
            type="button"
            onClick={handleSkip}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-full border border-amber-500/20 bg-black/40 px-4 py-2 text-xs font-sans tracking-wider text-amber-200/80 backdrop-blur-md transition-all hover:border-amber-400/50 hover:bg-black/60 hover:text-amber-100 cursor-pointer"
            aria-label="Skip introduction"
          >
            <span>تخطي / Skip</span>
            <X className="h-3.5 w-3.5 text-amber-400" />
          </motion.button>

          {/* Central Luxury Content Container */}
          <motion.div
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto"
          >
            {/* Royal Crest / Monogram Badge with Zoom In */}
            <div className="relative mb-6">
              {/* Outer soft spinning golden halo */}
              <motion.div
                initial={{ rotate: 0, scale: 0.3 }}
                animate={{ rotate: 180, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute -inset-3 rounded-full border border-dashed border-amber-400/30 pointer-events-none"
              />

              {/* Inner Crest Box */}
              <motion.div
                initial={{ scale: 0.3 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-400/40 bg-gradient-to-b from-[#1c1810] to-[#0d0b07] shadow-[0_0_40px_rgba(212,175,55,0.3)]"
              >
                {/* Crown / Sparkle Top Accents */}
                <motion.div
                  initial={{ scale: 0, y: 5 }}
                  animate={{ scale: 1, y: -12 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: "backOut" }}
                  className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 text-amber-400"
                >
                  <Sparkles className="h-4 w-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                </motion.div>

                {/* Monogram "R" with Utensils flourish and zoom in */}
                <motion.span
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
                >
                  R
                </motion.span>

                {/* Small bottom icon */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full border border-amber-500/30 bg-[#120f0a] px-2 py-0.5 text-[9px] text-amber-300/90 shadow-sm flex items-center gap-1">
                  <Utensils className="h-2.5 w-2.5 text-amber-400" />
                </div>
              </motion.div>
            </div>

            {/* Restaurant Name - Zoom-In */}
            <motion.div
              initial={{ scale: 0.4, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="space-y-1"
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.25em] md:tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 drop-shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                Renaissance
              </h1>
              <p className="font-serif text-sm md:text-base text-amber-200/70 tracking-[0.2em] uppercase">
                Fine Dining & Haute Cuisine
              </p>
            </motion.div>

            {/* Elegant Golden Divider Line with Centered Diamond */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.65, ease: "easeOut" }}
              className="my-5 flex items-center justify-center gap-3 w-64 md:w-80"
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/50 to-amber-300" />
              <div className="h-1.5 w-1.5 rotate-45 border border-amber-300/80 bg-amber-400/40" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400/50 to-amber-300" />
            </motion.div>

            {/* Arabic Luxury Welcome Subtitle */}
            <motion.p
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-xs md:text-sm font-sans tracking-wide text-amber-100/60"
            >
              أهلاً بكم في عالم الفخامة والمذاق الرفيع
            </motion.p>

            {/* Subtle Progress Bar */}
            <div className="mt-8 w-44 md:w-56 h-[2px] rounded-full bg-amber-950/60 overflow-hidden relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-100 shadow-[0_0_10px_rgba(212,175,55,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
