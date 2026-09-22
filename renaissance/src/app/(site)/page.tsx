import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BookingCTA } from "@/components/home/BookingCTA";
import { InteractiveWelcome } from "@/components/home/InteractiveWelcome";

export default function HomePage() {
  return (
    <>
      <InteractiveWelcome />
      <HeroSection />
      <AboutSection />
      <FeaturedDishes />
      <TestimonialsSection />
      <BookingCTA />
    </>
  );
}
