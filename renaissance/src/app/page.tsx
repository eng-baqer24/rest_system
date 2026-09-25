import { IntroSplashScreen } from "@/components/home/IntroSplashScreen";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BookingCTA } from "@/components/home/BookingCTA";

export default function HomePage() {
  return (
    <>
      <IntroSplashScreen />
      <HeroSection />
      <AboutSection />
      <FeaturedDishes />
      <TestimonialsSection />
      <BookingCTA />
    </>
  );
}
