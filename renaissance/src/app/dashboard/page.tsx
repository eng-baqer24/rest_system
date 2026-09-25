"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Plus,
  Sliders,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  UtensilsCrossed,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Save,
  Building,
  Bell,
  Trash2,
  Edit3,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MENU_CATEGORIES } from "@/data/menu";
import { MenuManager } from "@/components/dashboard/MenuManager";

interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  table_number?: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt?: string;
}

interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  isAcceptingBookings: boolean;
  openingHours: string;
  operatingDays: string;
  phone: string;
  email: string;
  address: string;
  maxGuestsPerSlot: number;
  autoConfirm: boolean;
  announcementText: string;
  showAnnouncement: boolean;
  currency: string;
  updatedAt: string;
}

type TabType = "reservations" | "controls" | "menu" | "reports";
type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";
type DateFilter = "all" | "today" | "upcoming";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState<string>("مدير المطعم");

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("reservations");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Authentication check
  useEffect(() => {
    const isAuth =
      localStorage.getItem("admin_auth") === "true" ||
      document.cookie.includes("admin_session=authenticated");

    if (!isAuth) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
      const storedName = localStorage.getItem("admin_name");
      if (storedName) setAdminName(storedName);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_name");
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.replace("/login");
  };

  // Settings State
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [newBooking, setNewBooking] = useState<{
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    notes: string;
    status: "confirmed" | "pending";
  }>({
    name: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    guests: 2,
    notes: "",
    status: "confirmed",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations", { cache: "no-store" });
      const data = await res.json();
      if (data.reservations) {
        setReservations(data.reservations);
      }
    } catch (e) {
      console.error("Failed to load reservations:", e);
      showToast("تعذر جلب الحجوزات، يرجى المحاولة لاحقاً", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
  };

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const [resRes, setRes] = await Promise.all([
          fetch("/api/reservations", { cache: "no-store" }),
          fetch("/api/settings", { cache: "no-store" }),
        ]);
        const resData = await resRes.json();
        const setData = await setRes.json();

        if (!ignore) {
          if (resData.reservations) {
            setReservations(resData.reservations);
          }
          if (setData.settings) {
            setSettings(setData.settings);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  // Handle Status Update (e.g. Approve/Confirm, Cancel, Complete)
  const handleUpdateStatus = async (
    id: string,
    newStatus: "confirmed" | "cancelled" | "completed" | "pending"
  ) => {
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );

        if (newStatus === "confirmed") {
          showToast(`تمت الموافقة على الحجز #${id} بنجاح!`, "success");
        } else if (newStatus === "cancelled") {
          showToast(`تم إلغاء/رفض الحجز #${id}`, "error");
        } else if (newStatus === "completed") {
          showToast(`تم تعيين الحجز #${id} كمكتمل وحضر الضيوف`, "success");
        } else {
          showToast(`تم تحديث حالة الحجز #${id}`, "success");
        }
      } else {
        throw new Error(data.error || "Failed to update");
      }
    } catch (error) {
      console.error("Update status error:", error);
      showToast("حدث خطأ أثناء تعديل حالة الحجز", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete
  const handleDeleteReservation = async (id: string) => {
    if (!confirm(`هل أنت متأكد من حذف الحجز ${id} نهائياً؟`)) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/reservations?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        showToast(`تم حذف الحجز #${id} بنجاح`, "success");
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      console.error("Delete error:", e);
      showToast("فشل حذف الحجز", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("تم حفظ كافة إعدادات الموقع والمطعم بنجاح!", "success");
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      console.error("Save settings error:", e);
      showToast("تعذر حفظ الإعدادات، يرجى المحاولة مجدداً", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle Create Manual Reservation
  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.name || !newBooking.phone || !newBooking.date || !newBooking.time) {
      showToast("يرجى ملء الاسم، الهاتف، التاريخ والوقت", "error");
      return;
    }
    setActionLoadingId("new");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("تم إنشاء الحجز بنجاح!", "success");
        setIsAddModalOpen(false);
        setNewBooking({
          name: "",
          phone: "",
          email: "",
          date: new Date().toISOString().split("T")[0],
          time: "20:00",
          guests: 2,
          notes: "",
          status: "confirmed",
        });
        fetchReservations();
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      console.error("Create booking error:", e);
      showToast("تعذر إضافة الحجز", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Edit Reservation Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;
    setActionLoadingId("edit");
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingReservation.id,
          guests: editingReservation.guests,
          date: editingReservation.date,
          time: editingReservation.time,
          notes: editingReservation.notes,
          status: editingReservation.status,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === editingReservation.id ? editingReservation : r))
        );
        showToast("تم حفظ التعديلات بنجاح", "success");
        setEditingReservation(null);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      console.error("Save edit error:", e);
      showToast("فشل حفظ التعديلات", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (reservations.length === 0) {
      showToast("لا توجد حجوزات للتصدير", "error");
      return;
    }
    const headers = ["ID,Date,Time,Guests,Name,Phone,Email,Status,Notes,CreatedAt"];
    const rows = reservations.map((r) =>
      [
        `"${r.id}"`,
        `"${r.date}"`,
        `"${r.time}"`,
        r.guests,
        `"${r.name || ""}"`,
        `"${r.phone || ""}"`,
        `"${r.email || ""}"`,
        `"${r.status}"`,
        `"${(r.notes || "").replace(/"/g, '""')}"`,
        `"${r.createdAt}"`,
      ].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `renaissance-reservations-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تنزيل ملف الحجوزات بنجاح", "success");
  };

  // Filtered Reservations
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      // Status filter
      if (statusFilter !== "all" && r.status !== statusFilter) {
        return false;
      }
      // Date filter
      if (dateFilter === "today" && r.date !== todayStr) {
        return false;
      }
      if (dateFilter === "upcoming" && r.date < todayStr) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = r.name?.toLowerCase().includes(q);
        const matchesPhone = r.phone?.toLowerCase().includes(q);
        const matchesId = r.id?.toLowerCase().includes(q);
        const matchesEmail = r.email?.toLowerCase().includes(q);
        const matchesNotes = r.notes?.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesId || matchesEmail || matchesNotes;
      }
      return true;
    });
  }, [reservations, statusFilter, dateFilter, searchQuery, todayStr]);

  // Statistics
  const stats = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const confirmed = reservations.filter((r) => r.status === "confirmed").length;
    const completed = reservations.filter((r) => r.status === "completed").length;
    const cancelled = reservations.filter((r) => r.status === "cancelled").length;
    const todayBookings = reservations.filter((r) => r.date === todayStr);
    const todayGuests = todayBookings
      .filter((r) => r.status === "confirmed" || r.status === "pending")
      .reduce((sum, r) => sum + (Number(r.guests) || 0), 0);

    return { total, pending, confirmed, completed, cancelled, todayBookingsCount: todayBookings.length, todayGuests };
  }, [reservations, todayStr]);

  const getWhatsAppLink = (phone: string | null, name: string | null, date: string, time: string) => {
    if (!phone) return "#";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `مرحباً ${name || "عزيزنا الضيف"}،\nيسعدنا إبلاغك بأنه تمت الموافقة على حجزك في مطعم Renaissance لتاريخ ${date} الساعة ${time}.\nنتطلع بشوق لتقديم أرقى تجربة طعام استثنائية لكم!`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-foreground">
        <div className="text-center space-y-4">
          <div className="size-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">جاري التحقق من صلاحيات المدير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-foreground pb-20 pt-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-xl border flex items-center gap-3 backdrop-blur-md text-sm font-medium ${
              toast.type === "success"
                ? "bg-[#102a1d]/90 text-emerald-300 border-emerald-700/50"
                : "bg-[#2d1215]/90 text-rose-300 border-rose-700/50"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="size-5 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="mr-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-border/40">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase">
              Admin Suite
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                استقبال الحجوزات أونلاين:{" "}
                <strong className={settings?.isAcceptingBookings ? "text-emerald-400" : "text-rose-400"}>
                  {settings?.isAcceptingBookings ? "مفعّل" : "متوقف"}
                </strong>
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-white mt-1">
            لوحة تحكم رينيسانس | Renaissance
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            إدارة الحجوزات والموافقة الفورية، والتحكم بإعدادات الموقع والمطعم وقائمة الطعام
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Admin Logged-in info & Logout button */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs shadow-sm">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span className="text-muted-foreground hidden sm:inline">مرحباً:</span>
            <span className="font-semibold text-foreground">{adminName}</span>
            <button
              onClick={handleLogout}
              className="mr-1.5 text-rose-400 hover:text-rose-300 flex items-center gap-1 border-r border-border pr-2 transition-colors"
              title="تسجيل الخروج والعودة لصفحة الدخول"
            >
              <LogOut className="size-3.5" />
              <span>خروج</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="border-border hover:bg-muted gap-2 text-xs h-9"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            <span className="hidden sm:inline">تحديث البيانات</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs h-9 shadow-sm"
          >
            <Plus className="size-4" />
            <span>حجز جديد</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            asChild
            className="gap-1.5 text-xs h-9 bg-card border border-border/80 hover:border-primary/50 text-foreground"
          >
            <Link href="/" target="_blank">
              <ArrowUpRight className="size-3.5 text-primary" />
              <span className="hidden sm:inline">الموقع الرئيسي</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        {/* Pending Card (Most Important) */}
        <Card
          onClick={() => {
            setActiveTab("reservations");
            setStatusFilter("pending");
          }}
          className={`cursor-pointer transition-all duration-200 relative overflow-hidden border ${
            statusFilter === "pending"
              ? "border-primary ring-1 ring-primary/40 bg-primary/5"
              : "border-border/60 hover:border-primary/40 bg-card/60"
          }`}
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">بانتظار الموافقة</span>
              <span className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                <AlertCircle className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-400">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">طلب حجز</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>يتطلب مراجعتك للموافقة</span>
            </div>
          </div>
        </Card>

        {/* Confirmed Card */}
        <Card
          onClick={() => {
            setActiveTab("reservations");
            setStatusFilter("confirmed");
          }}
          className={`cursor-pointer transition-all duration-200 border ${
            statusFilter === "confirmed"
              ? "border-emerald-500/60 ring-1 ring-emerald-500/40 bg-emerald-500/5"
              : "border-border/60 hover:border-emerald-500/40 bg-card/60"
          }`}
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">حجوزات مؤكدة</span>
              <span className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400">{stats.confirmed}</span>
              <span className="text-xs text-muted-foreground">حجز موافق عليه</span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              جاهزة للاستقبال والتحضير
            </div>
          </div>
        </Card>

        {/* Today's Schedule Card */}
        <Card
          onClick={() => {
            setActiveTab("reservations");
            setDateFilter("today");
          }}
          className={`cursor-pointer transition-all duration-200 border ${
            dateFilter === "today"
              ? "border-primary ring-1 ring-primary/40 bg-primary/5"
              : "border-border/60 hover:border-primary/40 bg-card/60"
          }`}
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">حجوزات اليوم</span>
              <span className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">{stats.todayBookingsCount}</span>
              <span className="text-xs text-muted-foreground">طاولات اليوم</span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              تاريخ: {todayStr}
            </div>
          </div>
        </Card>

        {/* Expected Guests Card */}
        <Card className="border border-border/60 bg-card/60">
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">الضيوف المتوقعين اليوم</span>
              <span className="size-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                <Users className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-sky-400">{stats.todayGuests}</span>
              <span className="text-xs text-muted-foreground">ضيف</span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              مجموع الكراسي المحجوزة
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("reservations")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "reservations"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="size-4" />
          <span>إدارة الحجوزات والموافقة</span>
          {stats.pending > 0 && (
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {stats.pending}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("controls")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "controls"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders className="size-4" />
          <span>التحكم بالموقع والمطعم</span>
        </button>

        <button
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "menu"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UtensilsCrossed className="size-4" />
          <span>قائمة الطعام والأطباق</span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "reports"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="size-4" />
          <span>التقارير والتصدير</span>
        </button>
      </div>

      {/* Tab 1: Reservations Management */}
      {activeTab === "reservations" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-card/70 border border-border/70 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم، رقم الهاتف، أو رقم الحجز..."
                className="pr-9 bg-background/50 border-border/80 text-sm h-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              {[
                { id: "all" as const, label: "الكل", count: stats.total },
                { id: "pending" as const, label: "بانتظار الموافقة", count: stats.pending },
                { id: "confirmed" as const, label: "مؤكدة", count: stats.confirmed },
                { id: "completed" as const, label: "مكتملة", count: stats.completed },
                { id: "cancelled" as const, label: "ملغية", count: stats.cancelled },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? "bg-primary text-black font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      statusFilter === tab.id
                        ? "bg-black/30 text-black font-bold"
                        : tab.id === "pending" && tab.count > 0
                        ? "bg-amber-500/20 text-amber-400 font-bold"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Date Filter & Export */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="bg-background/60 border border-border/80 text-xs rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">جميع التواريخ</option>
                <option value="today">اليوم ({todayStr})</option>
                <option value="upcoming">الحجوزات القادمة</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                title="تصدير الحجوزات إلى ملف Excel / CSV"
                className="h-8.5 text-xs border-border/80 gap-1.5"
              >
                <FileSpreadsheet className="size-3.5 text-emerald-400" />
                <span className="hidden sm:inline">تصدير CSV</span>
              </Button>
            </div>
          </div>

          {/* Reservations List */}
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
              <RefreshCw className="size-6 animate-spin text-primary" />
              <span>جاري تحميل بيانات الحجوزات...</span>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="bg-card/40 border border-dashed border-border/70 rounded-xl p-12 text-center">
              <Calendar className="size-10 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">لا توجد حجوزات مطابقة</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                لم يتم العثور على أي حجز وفق معايير الفلترة المحددة. جرب تغيير الحالة أو البحث.
              </p>
              {(statusFilter !== "all" || dateFilter !== "all" || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all");
                    setDateFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-xs"
                >
                  إعادة ضبط الفلاتر
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReservations.map((reservation) => {
                const isPending = reservation.status === "pending";
                const isConfirmed = reservation.status === "confirmed";
                const isCompleted = reservation.status === "completed";
                const isCancelled = reservation.status === "cancelled";
                const isLoadingAction = actionLoadingId === reservation.id;

                return (
                  <motion.div
                    key={reservation.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-card/70 rounded-xl border p-4 sm:p-5 transition-all ${
                      isPending
                        ? "border-amber-500/40 bg-amber-500/[0.02] shadow-sm shadow-amber-500/5"
                        : isConfirmed
                        ? "border-emerald-500/30"
                        : "border-border/60"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left / Info Section */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center flex-wrap gap-2.5">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                            {reservation.id}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              isPending
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                : isConfirmed
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : isCompleted
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {isPending && <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />}
                            {isConfirmed && <CheckCircle2 className="size-3" />}
                            {isCompleted && <Check className="size-3" />}
                            {isCancelled && <XCircle className="size-3" />}
                            <span>
                              {isPending
                                ? "بانتظار الموافقة"
                                : isConfirmed
                                ? "حجز مؤكد"
                                : isCompleted
                                ? "مكتمل (حضر الضيف)"
                                : "ملغي / مرفوض"}
                            </span>
                          </span>

                          {/* Table Number Badge */}
                          {reservation.table_number && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-primary/20 text-[#FFE885] border border-primary/40 font-mono shadow-sm">
                              <span>طاولة: {reservation.table_number}</span>
                            </span>
                          )}

                          <span className="text-xs text-muted-foreground mr-auto">
                            تم الطلب: {new Date(reservation.createdAt).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {/* Customer & Booking Key Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 text-xs font-bold">
                              {reservation.name ? reservation.name.charAt(0) : "ض"}
                            </span>
                            <div>
                              <div className="font-medium text-sm text-foreground">
                                {reservation.name || "ضيف رينيسانس"}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <a
                                  href={`tel:${reservation.phone}`}
                                  className="hover:text-primary transition-colors flex items-center gap-1"
                                  dir="ltr"
                                >
                                  <Phone className="size-3 text-primary" />
                                  <span>{reservation.phone || "بدون هاتف"}</span>
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar className="size-4 text-primary shrink-0" />
                            <div>
                              <div className="font-medium text-xs sm:text-sm">{reservation.date}</div>
                              <div className="text-xs text-muted-foreground">
                                {reservation.date === todayStr ? "اليوم" : "تاريخ محدد"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Clock className="size-4 text-primary shrink-0" />
                            <div>
                              <div className="font-medium text-xs sm:text-sm">{reservation.time}</div>
                              <div className="text-xs text-muted-foreground">الموعد المحدد</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Users className="size-4 text-primary shrink-0" />
                            <div>
                              <div className="font-medium text-xs sm:text-sm">{reservation.guests} ضيوف</div>
                              <div className="text-xs text-muted-foreground">حجم الطاولة</div>
                            </div>
                          </div>
                        </div>

                        {/* Notes / Special Requests */}
                        {reservation.notes && (
                          <div className="mt-2 text-xs bg-muted/40 border border-border/40 rounded-lg p-2.5 text-foreground/90 flex items-start gap-2">
                            <span className="font-semibold text-primary shrink-0">ملاحظات العميل:</span>
                            <span className="text-muted-foreground">{reservation.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Right / Actions Buttons */}
                      <div className="flex items-center flex-wrap gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40 justify-end">
                        {/* 1. APPROVE BUTTON - Most Prominent */}
                        {isPending && (
                          <Button
                            size="sm"
                            disabled={isLoadingAction}
                            onClick={() => handleUpdateStatus(reservation.id, "confirmed")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-md shadow-emerald-950/40"
                          >
                            <CheckCircle2 className="size-4" />
                            <span>موافقة على الحجز</span>
                          </Button>
                        )}

                        {/* WhatsApp Message */}
                        {reservation.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            title="إرسال تأكيد الحجز للعميل عبر واتساب"
                            className="border-emerald-600/40 text-emerald-400 hover:bg-emerald-950/30 text-xs h-9 px-3 gap-1.5"
                          >
                            <a
                              href={getWhatsAppLink(
                                reservation.phone,
                                reservation.name,
                                reservation.date,
                                reservation.time
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="size-3.5" />
                              <span className="hidden sm:inline">واتساب</span>
                            </a>
                          </Button>
                        )}

                        {/* Mark Completed (for confirmed reservations) */}
                        {isConfirmed && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoadingAction}
                            onClick={() => handleUpdateStatus(reservation.id, "completed")}
                            className="border-blue-500/40 text-blue-400 hover:bg-blue-950/30 text-xs h-9 px-3 gap-1.5"
                          >
                            <Check className="size-3.5" />
                            <span>تسجيل الحضور</span>
                          </Button>
                        )}

                        {/* Reject / Cancel */}
                        {!isCancelled && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoadingAction}
                            onClick={() => handleUpdateStatus(reservation.id, "cancelled")}
                            className="border-rose-500/40 text-rose-400 hover:bg-rose-950/30 text-xs h-9 px-3 gap-1.5"
                          >
                            <X className="size-3.5" />
                            <span>{isPending ? "رفض الطلب" : "إلغاء"}</span>
                          </Button>
                        )}

                        {/* Reset to Pending (if cancelled or completed) */}
                        {(isCancelled || isCompleted) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isLoadingAction}
                            onClick={() => handleUpdateStatus(reservation.id, "pending")}
                            className="text-xs h-9 text-muted-foreground hover:text-foreground"
                          >
                            إرجاع للمراجعة
                          </Button>
                        )}

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingReservation(reservation)}
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
                          title="تعديل تفاصيل الحجز"
                        >
                          <Edit3 className="size-3.5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoadingAction}
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="h-9 w-9 p-0 text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/30"
                          title="حذف الحجز"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Website Controls & Settings */}
      {activeTab === "controls" && (
        <div className="max-w-4xl space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Quick Online Bookings Switch */}
            <Card className="border-border/80 bg-card/70 overflow-hidden">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-foreground font-semibold flex items-center gap-2">
                      <ShieldAlert className="size-5 text-primary" />
                      <span>استقبال الحجوزات أونلاين عبر الموقع</span>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      التحكم الفوري في إمكانية حجز الطاولات من قبل زوار الموقع
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) =>
                          prev ? { ...prev, isAcceptingBookings: !prev.isAcceptingBookings } : null
                        )
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings?.isAcceptingBookings ? "bg-emerald-500" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          settings?.isAcceptingBookings ? "translate-x-0" : "-translate-x-5"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-semibold text-foreground">
                      {settings?.isAcceptingBookings ? "مفتوح" : "مغلق مؤقتاً"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-xs text-muted-foreground">
                في حال إيقاف الحجز، سيظهر للعميل تنبيه لطيف بأن استقبال الحجوزات مكتمل مؤقتاً مع توجيهه للاتصال الهاتفي.
              </CardContent>
            </Card>

            {/* Announcement Banner */}
            <Card className="border-border/80 bg-card/70">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-foreground font-semibold flex items-center gap-2">
                    <Bell className="size-5 text-primary" />
                    <span>شريط الإعلان أعلى الموقع (Announcement Banner)</span>
                  </CardTitle>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.showAnnouncement ?? true}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev ? { ...prev, showAnnouncement: e.target.checked } : null
                        )
                      }
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>إظهار الإعلان</span>
                  </label>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <label className="text-xs text-muted-foreground block font-medium">نص الإعلان الترويجي أو التنبيهي</label>
                <Input
                  type="text"
                  value={settings?.announcementText || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, announcementText: e.target.value } : null
                    )
                  }
                  placeholder="اكتب الإعلان الترويجي الذي يظهر لجميع زوار الموقع..."
                  className="text-sm bg-background/60"
                />
              </CardContent>
            </Card>

            {/* Operating Hours & Contact Info */}
            <Card className="border-border/80 bg-card/70">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base text-foreground font-semibold flex items-center gap-2">
                  <Building className="size-5 text-primary" />
                  <span>معلومات المطعم ومواعيد الاستقبال</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium">ساعات العمل اليومية</label>
                    <Input
                      type="text"
                      value={settings?.openingHours || ""}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev ? { ...prev, openingHours: e.target.value } : null
                        )
                      }
                      placeholder="5:00 PM – 11:00 PM"
                      className="text-sm bg-background/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium">أيام العمل</label>
                    <Input
                      type="text"
                      value={settings?.operatingDays || ""}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev ? { ...prev, operatingDays: e.target.value } : null
                        )
                      }
                      placeholder="يومياً (Daily)"
                      className="text-sm bg-background/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium">رقم هاتف الحجوزات</label>
                    <Input
                      type="text"
                      value={settings?.phone || ""}
                      onChange={(e) =>
                        setSettings((prev) => (prev ? { ...prev, phone: e.target.value } : null))
                      }
                      placeholder="01234567889"
                      dir="ltr"
                      className="text-sm bg-background/60 text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium">البريد الإلكتروني للإدارة</label>
                    <Input
                      type="email"
                      value={settings?.email || ""}
                      onChange={(e) =>
                        setSettings((prev) => (prev ? { ...prev, email: e.target.value } : null))
                      }
                      placeholder="reservations@renaissance.com"
                      dir="ltr"
                      className="text-sm bg-background/60 text-right"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs text-muted-foreground font-medium">العنوان المعروض في الموقع والفوتر</label>
                    <Input
                      type="text"
                      value={settings?.address || ""}
                      onChange={(e) =>
                        setSettings((prev) => (prev ? { ...prev, address: e.target.value } : null))
                      }
                      placeholder="Golden Avenue, Baghdad"
                      className="text-sm bg-background/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium">أقصى عدد ضيوف لكل فترة</label>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      value={settings?.maxGuestsPerSlot || 40}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev ? { ...prev, maxGuestsPerSlot: Number(e.target.value) } : null
                        )
                      }
                      className="text-sm bg-background/60"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="autoConfirmCheck"
                      checked={settings?.autoConfirm ?? false}
                      onChange={(e) =>
                        setSettings((prev) =>
                          prev ? { ...prev, autoConfirm: e.target.checked } : null
                        )
                      }
                      className="rounded border-border text-primary focus:ring-primary size-4"
                    />
                    <label htmlFor="autoConfirmCheck" className="text-xs text-foreground cursor-pointer font-medium">
                      الموافقة التلقائية الفورية على أي حجز جديد
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="submit"
                disabled={savingSettings}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
              >
                <Save className="size-4" />
                <span>{savingSettings ? "جاري الحفظ..." : "حفظ كافة التغييرات"}</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Interactive Menu Management */}
      {activeTab === "menu" && (
        <MenuManager onShowToast={showToast} />
      )}

      {/* Tab 4: Analytics & Reports */}
      {activeTab === "reports" && (
        <div className="space-y-6 max-w-4xl">
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-foreground font-semibold flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" />
                    <span>ملخص أداء الحجوزات ونسب الإشغال</span>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    إحصائيات فورية وتفصيلية عن حركة الزبائن والطاولات
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="gap-1.5 text-xs"
                >
                  <Printer className="size-3.5" />
                  <span>طباعة الكشف</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              {/* Status Breakdown Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>توزيع الحالات</span>
                  <span>الإجمالي: {stats.total} حجز</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${stats.total ? (stats.confirmed / stats.total) * 100 : 0}%` }}
                    className="bg-emerald-500 h-full"
                    title={`مؤكد: ${stats.confirmed}`}
                  />
                  <div
                    style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}
                    className="bg-amber-500 h-full"
                    title={`معلق: ${stats.pending}`}
                  />
                  <div
                    style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}
                    className="bg-blue-500 h-full"
                    title={`مكتمل: ${stats.completed}`}
                  />
                  <div
                    style={{ width: `${stats.total ? (stats.cancelled / stats.total) * 100 : 0}%` }}
                    className="bg-rose-500 h-full"
                    title={`ملغي: ${stats.cancelled}`}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-500" />
                    <span>مؤكد ({stats.confirmed})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    <span>بانتظار الموافقة ({stats.pending})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-blue-500" />
                    <span>مكتمل ({stats.completed})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-rose-500" />
                    <span>ملغي ({stats.cancelled})</span>
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">تصدير قاعدة بيانات الحجوزات</h4>
                  <p className="text-xs text-muted-foreground">
                    تنزيل ملف كامل بجميع الحجوزات مع تفاصيل الاتصال والملاحظات
                  </p>
                </div>
                <Button
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shrink-0"
                >
                  <FileSpreadsheet className="size-4" />
                  <span>تنزيل CSV / Excel</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal 1: Add New Reservation Manually */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl relative"
            dir="rtl"
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-1">تسجيل حجز جديد (حضور مباشر / اتصال)</h3>
            <p className="text-xs text-muted-foreground mb-4">
              إضافة حجز مباشرة من الإدارة مع إمكانية اعتماده كمؤكد فوراً
            </p>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">اسم العميل *</label>
                <Input
                  required
                  value={newBooking.name}
                  onChange={(e) => setNewBooking({ ...newBooking, name: e.target.value })}
                  placeholder="مثال: د. محمد البغدادي"
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">رقم الهاتف *</label>
                  <Input
                    required
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                    placeholder="+964..."
                    dir="ltr"
                    className="text-sm text-right"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">البريد الإلكتروني (اختياري)</label>
                  <Input
                    type="email"
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                    placeholder="email@example.com"
                    dir="ltr"
                    className="text-sm text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">التاريخ *</label>
                  <Input
                    type="date"
                    required
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">الوقت *</label>
                  <select
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm"
                  >
                    {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">الضيوف *</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={newBooking.guests}
                    onChange={(e) => setNewBooking({ ...newBooking, guests: Number(e.target.value) })}
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">ملاحظات وطلبات خاصة</label>
                <Input
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  placeholder="مثال: طاولة قرب النافذة، مقعد أطفال، مناسبة خاصة..."
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">الحالة المبدئية</label>
                <select
                  value={newBooking.status}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, status: e.target.value as "confirmed" | "pending" })
                  }
                  className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm"
                >
                  <option value="confirmed">مؤكد فوراً (Approved)</option>
                  <option value="pending">بانتظار الموافقة (Pending)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={actionLoadingId === "new"}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoadingId === "new" ? "جاري الإضافة..." : "حفظ الحجز"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal 2: Edit Reservation */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl relative"
            dir="rtl"
          >
            <button
              onClick={() => setEditingReservation(null)}
              className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-1">
              تعديل الحجز #{editingReservation.id}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              العميل: {editingReservation.name || "ضيف"} ({editingReservation.phone || "بدون هاتف"})
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">التاريخ</label>
                  <Input
                    type="date"
                    value={editingReservation.date}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, date: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">الوقت</label>
                  <select
                    value={editingReservation.time}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, time: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm"
                  >
                    {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">عدد الضيوف</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={editingReservation.guests}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        guests: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">الحالة</label>
                  <select
                    value={editingReservation.status}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        status: e.target.value as Reservation["status"],
                      })
                    }
                    className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm"
                  >
                    <option value="pending">بانتظار الموافقة (Pending)</option>
                    <option value="confirmed">موافق عليه / مؤكد (Confirmed)</option>
                    <option value="completed">مكتمل / حضر (Completed)</option>
                    <option value="cancelled">ملغي / مرفوض (Cancelled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">ملاحظات خاصة</label>
                <Input
                  value={editingReservation.notes || ""}
                  onChange={(e) =>
                    setEditingReservation({ ...editingReservation, notes: e.target.value })
                  }
                  className="text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingReservation(null)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={actionLoadingId === "edit"}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoadingId === "edit" ? "جاري الحفظ..." : "حفظ التعديلات"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
