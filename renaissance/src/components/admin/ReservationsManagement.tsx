"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Reservation {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  guests: number;
  date: string;
  time: string;
  status: string;
  notes?: string | null;
  tableId?: string | null;
  tableName?: string | null;
  createdAt?: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

interface ReservationsManagementProps {
  onStatsChange?: (stats: ReservationStats) => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغي",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  confirmed: "border-green-500/30 bg-green-500/10 text-green-400",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
};

export function ReservationsManagement({ onStatsChange }: ReservationsManagementProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reservations");
      if (res.ok) {
        const data = await res.json();
        const list: Reservation[] = data.reservations ?? [];
        setReservations(list);

        if (onStatsChange) {
          const stats: ReservationStats = {
            total: list.length,
            pending: list.filter((r) => r.status === "pending").length,
            confirmed: list.filter((r) => r.status === "confirmed").length,
            cancelled: list.filter((r) => r.status === "cancelled").length,
          };
          onStatsChange(stats);
        }
      } else {
        setError("تعذّر تحميل الحجوزات من قاعدة البيانات.");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }, [onStatsChange]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setReservations((prev) => {
          const updated = prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
          if (onStatsChange) {
            onStatsChange({
              total: updated.length,
              pending: updated.filter((r) => r.status === "pending").length,
              confirmed: updated.filter((r) => r.status === "confirmed").length,
              cancelled: updated.filter((r) => r.status === "cancelled").length,
            });
          }
          return updated;
        });

        if (selectedReservation && selectedReservation.id === id) {
          setSelectedReservation((prev) => (prev ? { ...prev, status: newStatus } : null));
        }

        setSuccessMessage(`تم تحديث حالة الحجز إلى: ${STATUS_LABELS[newStatus] ?? newStatus}`);
        setTimeout(() => setSuccessMessage(""), 3500);
      } else {
        setError("تعذّر تحديث حالة الحجز.");
      }
    } catch {
      setError("حدث خطأ أثناء محاولة تحديث الحجز.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reservations/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteId(null);
        setSuccessMessage("تم حذف الحجز بنجاح.");
        setTimeout(() => setSuccessMessage(""), 3500);
        await fetchReservations();
      } else {
        setError("تعذّر حذف الحجز.");
      }
    } catch {
      setError("حدث خطأ أثناء محاولة الحذف.");
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(dateStr: string) {
    try {
      return format(new Date(dateStr), "d MMMM yyyy", { locale: arSA });
    } catch {
      return dateStr;
    }
  }

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchQuery =
        !searchQuery ||
        (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.phone && r.phone.includes(searchQuery)) ||
        (r.tableName && r.tableName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === "all" || r.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [reservations, searchQuery, statusFilter]);

  return (
    <Card className="border-border/80 bg-card/60 shadow-lg backdrop-blur">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            <CardTitle className="font-serif text-xl">إدارة حجوزات الطاولات</CardTitle>
          </div>
          <CardDescription className="mt-1">
            متابعة وتحديث حالات الحجوزات الواردة من عملاء المطعم
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReservations}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">تحديث الحجوزات</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث بالاسم أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>

          <div className="flex rounded-lg border border-border/80 bg-background/60 p-1 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              الكل ({reservations.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                statusFilter === "pending"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              قيد الانتظار ({reservations.filter((r) => r.status === "pending").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("confirmed")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                statusFilter === "confirmed"
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              مؤكد ({reservations.filter((r) => r.status === "confirmed").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("cancelled")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                statusFilter === "cancelled"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ملغي ({reservations.filter((r) => r.status === "cancelled").length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">جاري تحميل قائمة الحجوزات...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 p-12 text-center">
            <Calendar className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 font-medium text-foreground">
              {reservations.length === 0
                ? "لا توجد حجوزات مسجلة في النظام حتى الآن."
                : "لا توجد حجوزات مطابقة لمعايير البحث المحددة."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {reservations.length === 0
                ? "ستظهر هنا تلقائياً الحجوزات الجديدة عند قيام الزوار بالحجز من الموقع."
                : "جرب تغيير حالة الفلتر أو مسح مصطلح البحث."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>الطاولة</TableHead>
                  <TableHead>الأشخاص</TableHead>
                  <TableHead>التاريخ والوقت</TableHead>
                  <TableHead>الحالة الحالية</TableHead>
                  <TableHead className="text-left">تحديث الحالة / إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {reservation.name || "عميل بدون اسم"}
                      </div>
                      {reservation.email && (
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {reservation.email}
                        </div>
                      )}
                    </TableCell>

                    <TableCell dir="ltr" className="text-right font-mono text-sm">
                      {reservation.phone ?? "—"}
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-foreground/90 font-medium">
                        {reservation.tableName ?? reservation.tableId ?? "طاولة قياسية"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="size-3.5 text-primary" />
                        <span>{reservation.guests} ضيوف</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-foreground">
                        {formatDate(reservation.date)}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="size-3" />
                        <span dir="ltr">{reservation.time}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          STATUS_COLORS[reservation.status] ?? "border-muted bg-muted text-muted-foreground"
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {STATUS_LABELS[reservation.status] ?? reservation.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-left">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === reservation.id ? (
                          <Loader2 className="size-4 animate-spin text-primary" />
                        ) : (
                          <Select
                            value={reservation.status}
                            onValueChange={(val) => updateStatus(reservation.id, val)}
                          >
                            <SelectTrigger className="w-[125px] h-8 text-xs" size="sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">قيد الانتظار</SelectItem>
                              <SelectItem value="confirmed">مؤكد</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        )}

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setSelectedReservation(reservation)}
                          title="عرض تفاصيل الحجز"
                          className="hover:text-primary"
                        >
                          <Eye className="size-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteId(reservation.id)}
                          title="حذف الحجز"
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>إجمالي الحجوزات المعروضة: {filteredReservations.length} من {reservations.length}</span>
        </div>
      </CardContent>

      {/* Reservation Details Dialog */}
      <Dialog
        open={selectedReservation !== null}
        onOpenChange={(open) => !open && setSelectedReservation(null)}
      >
        <DialogContent className="sm:max-w-md border-primary/30 bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              تفاصيل الحجز
            </DialogTitle>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                <div>
                  <span className="text-xs text-muted-foreground">اسم العميل:</span>
                  <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                    <User className="size-3.5 text-primary" />
                    {selectedReservation.name || "بدون اسم"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">رقم الهاتف:</span>
                  <p dir="ltr" className="font-mono text-foreground flex items-center justify-end gap-1 mt-0.5">
                    <Phone className="size-3.5 text-primary" />
                    {selectedReservation.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-border/40 bg-muted/20 p-2">
                  <span className="text-xs text-muted-foreground">الضيوف</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedReservation.guests} أشخاص</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-muted/20 p-2">
                  <span className="text-xs text-muted-foreground">الوقت</span>
                  <p dir="ltr" className="font-semibold text-foreground mt-0.5">{selectedReservation.time}</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-muted/20 p-2">
                  <span className="text-xs text-muted-foreground">الطاولة</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedReservation.tableName || "—"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">تاريخ الحجز:</span>
                <p className="font-medium text-foreground mt-0.5">{formatDate(selectedReservation.date)}</p>
              </div>

              {selectedReservation.email && (
                <div>
                  <span className="text-xs text-muted-foreground">البريد الإلكتروني:</span>
                  <p className="text-foreground mt-0.5">{selectedReservation.email}</p>
                </div>
              )}

              {selectedReservation.notes && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <span className="text-xs font-semibold text-primary">ملاحظات وطلبات خاصة للعميل:</span>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {selectedReservation.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground">الحالة الحالية:</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    STATUS_COLORS[selectedReservation.status]
                  )}
                >
                  {STATUS_LABELS[selectedReservation.status] ?? selectedReservation.status}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReservation(null)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md border-destructive/30 bg-card">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="size-5" />
              تأكيد حذف الحجز
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من رغبتك في حذف هذا الحجز نهائياً؟ سيتم مسح بيانات الحجز من قاعدة البيانات.
          </p>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "نعم، احذف الحجز"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
