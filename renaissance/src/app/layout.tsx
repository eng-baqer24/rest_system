import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookButton } from "@/components/StickyBookButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Renaissance | An Unforgettable Fine Dining Experience",
  description: "Fine dining restaurant — Welcome to a world of elegance and refinement. Reserve your table now.",
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
        <Header />
        <main className="min-h-screen pt-28 pb-24 md:pb-28">{children}</main>
        <Footer />
        <StickyBookButton />
      </body>
    </html>
  );
}
