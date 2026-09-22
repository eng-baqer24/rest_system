import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookButton } from "@/components/StickyBookButton";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 md:pb-28 md:pl-20">{children}</main>
      <Footer />
      <StickyBookButton />
    </>
  );
}
