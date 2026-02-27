import {
  MapPin,
  Clock,
  Phone,
  Shirt,
  Car,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:px-6">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-3xl font-semibold text-primary md:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground">
          Location, opening hours and more
        </p>
      </header>

      <div className="mx-auto max-w-4xl space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground">
                  Address
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Golden Avenue, Baghdad, Iraq
                </p>
                <a
                  href="https://maps.google.com/?q=Baghdad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  View on map
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground">
                  Opening Hours
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Sun – Thu: 11:00 AM – 12:00 AM
                  <br />
                  Fri & Sat: 12:00 PM – 12:00 AM
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground">
                  Phone
                </h3>
                <a
                  href="tel:01234567890"
                  className="mt-1 block text-muted-foreground hover:text-primary"
                >
                  01234567890
                </a>
              </div>
            </div>
          </div>

          <div className="aspect-[4/3] min-h-[280px] overflow-hidden rounded-lg bg-muted">
            <iframe
              title="Location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31942541.88329688!2d38.996815!3d33.315241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1559e8d2c2e7c8c1%3A0x1234567890abcdef!2sBaghdad%2C%20Iraq!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <section className="rounded-lg border border-border/40 bg-card p-6 md:p-8">
          <h2 className="font-serif text-xl font-semibold text-primary">
            More Information
          </h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <Shirt className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Dress code:</strong>{" "}
                Smart casual. We kindly ask to avoid sportswear.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Car className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Parking:</strong>{" "}
                Parking available for guests. Valet service on request.
              </span>
            </li>
          </ul>
        </section>

        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/booking">Reserve</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
