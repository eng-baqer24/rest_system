import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | Renaissance Admin",
  description: "إدارة مطعم Renaissance — القائمة وحجوزات الطاولات",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {children}
    </div>
  );
}
