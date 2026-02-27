import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-3xl font-semibold text-primary md:text-4xl">
          About Us
        </h1>
        <p className="mt-2 text-muted-foreground">
          Our philosophy and brand story
        </p>
      </header>

      <section className="mx-auto max-w-4xl space-y-12">
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
            alt="Restaurant interior"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold text-primary">
            Our Vision
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            At Renaissance we believe that fine dining should combine refined taste with comfort and elegance. We serve dishes inspired by world cuisine with a local touch, and we are committed to fresh, seasonal ingredients.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-serif text-xl font-semibold text-primary">
              The Chef&apos;s Philosophy
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The chef focuses on simplicity in composition and quality in execution. Every dish is presented as a work of art, respecting authentic flavour and elegant presentation.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80"
              alt="The chef"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl font-semibold text-primary">
            Our Brand Story
          </h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Renaissance was founded with a vision to offer a luxurious hospitality experience in the heart of the city. The name reflects a new beginning with every visit—unforgettable moments of taste, elegance and calm.
          </p>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/booking">Reserve</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
