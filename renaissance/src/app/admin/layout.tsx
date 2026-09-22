import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | Renaissance Admin",
  description: "إدارة المطعم — القائمة والحجوزات",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">{children}</div>
  );
}
