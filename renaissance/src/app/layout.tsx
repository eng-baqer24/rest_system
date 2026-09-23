import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookButton } from "@/components/StickyBookButton";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Renaissance - Fine Dining Restaurant",
  description:
    "An exquisite fine dining restaurant experience featuring table reservations, gourmet menus, and luxury culinary presentation.",
  openGraph: {
    title: "Renaissance - Fine Dining Restaurant",
    description:
      "An exquisite fine dining restaurant experience featuring table reservations, gourmet menus, and luxury culinary presentation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AnnouncementBanner />
        <Header />
        <main className="min-h-screen pt-28 pb-24 md:pb-28 md:pl-20">{children}</main>
        <Footer />
        <StickyBookButton />
      </body>
    </html>
  );
}
