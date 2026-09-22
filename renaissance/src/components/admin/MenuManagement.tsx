"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Check,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string | null;
}

interface Dish {
  id: string;
  nameAr: string;
  nameEn: string | null;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  categoryId: string;
  sortOrder: number;
  dish_categories?: Category | null;
}

interface DishFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
}

const emptyForm: DishFormData = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  imageUrl: "",
};

interface MenuManagementProps {
  onDishCountChange?: (count: number) => void;
}

export function MenuManagement({ onDishCountChange }: MenuManagementProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [form, setForm] = useState<DishFormData>(emptyForm);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dishesRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/dishes"),
        fetch("/api/admin/categories"),
      ]);

      if (dishesRes.ok) {
        const data = await dishesRes.json();
        const dishList = data.dishes ?? [];
        setDishes(dishList);
        if (onDishCountChange) {
          onDishCountChange(dishList.length);
        }
      } else {
        setError("تعذّر تحميل الأطباق من قاعدة البيانات.");
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories ?? []);
      }
    } catch {
      setError("تعذّر الاتصال بالخادم لتحميل قائمة الطعام.");
    } finally {
      setLoading(false);
    }
  }, [onDishCountChange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openAddDialog() {
    setEditingDish(null);
    setForm({
      ...emptyForm,
      categoryId: categories.length > 0 ? categories[0].id : "",
    });
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(dish: Dish) {
    setEditingDish(dish);
    setForm({
      name: dish.nameAr,
      description: dish.description ?? "",
      price: dish.price != null ? String(dish.price) : "",
      categoryId: dish.categoryId,
      imageUrl: dish.imageUrl ?? "",
    });
    setError("");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.categoryId) {
      setError("اسم الطبق والقسم مطلوبان.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      categoryId: form.categoryId,
      imageUrl: form.imageUrl.trim() || null,
    };

    try {
      const url = editingDish
        ? `/api/admin/dishes/${editingDish.id}`
        : "/api/admin/dishes";
      const method = editingDish ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "حدث خطأ أثناء الحفظ.");
        return;
      }

      setDialogOpen(false);
      setSuccessMessage(
        editingDish ? "تم تحديث بيانات الطبق بنجاح." : "تمت إضافة الطبق بنجاح."
      );
      setTimeout(() => setSuccessMessage(""), 4000);
      await fetchData();
    } catch {
      setError("حدث خطأ أثناء الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/dishes/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteId(null);
        setSuccessMessage("تم حذف الطبق بنجاح.");
        setTimeout(() => setSuccessMessage(""), 4000);
        await fetchData();
      } else {
        setError("تعذّر حذف الطبق.");
      }
    } catch {
      setError("حدث خطأ أثناء محاولة الحذف.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSeedMenu() {
    setSeeding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/seed-menu", { method: "POST" });
      if (res.ok) {
        setSuccessMessage("تم استيراد قائمة الطعام التأسيسية بنجاح!");
        setTimeout(() => setSuccessMessage(""), 4000);
        await fetchData();
      } else {
        const data = await res.json();
        setError(data.error || "تعذّر استيراد الأطباق التأسيسية.");
      }
    } catch {
      setError("حدث خطأ أثناء استيراد القائمة.");
    } finally {
      setSeeding(false);
    }
  }

  function getCategoryName(dish: Dish) {
    if (dish.dish_categories?.nameAr) return dish.dish_categories.nameAr;
    const cat = categories.find((c) => c.id === dish.categoryId);
    return cat?.nameAr ?? "—";
  }

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchQuery =
        !searchQuery ||
        dish.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.description &&
          dish.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategoryFilter === "all" ||
        dish.categoryId === selectedCategoryFilter;

      return matchQuery && matchCategory;
    });
  }, [dishes, searchQuery, selectedCategoryFilter]);

  return (
    <Card className="border-border/80 bg-card/60 shadow-lg backdrop-blur">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="size-5 text-primary" />
            <CardTitle className="font-serif text-xl">إدارة قائمة الطعام</CardTitle>
          </div>
          <CardDescription className="mt-1">
            عرض وتعديل وإضافة أطباق المطعم المخزنة في قاعدة البيانات
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {dishes.length === 0 && !loading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedMenu}
              disabled={seeding}
              className="border-primary/40 text-primary hover:bg-primary/10"
            >
              {seeding ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري الاستيراد...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  استيراد القائمة التأسيسية
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            title="تحديث البيانات"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">تحديث</span>
          </Button>

          <Button onClick={openAddDialog} size="sm" className="font-medium">
            <Plus className="size-4" />
            إضافة طبق جديد
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {/* Success message banner */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400">
            <Check className="size-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Global error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search and Category Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث باسم الطبق أو الوصف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="cat-filter" className="text-xs text-muted-foreground whitespace-nowrap">
              القسم:
            </Label>
            <Select
              value={selectedCategoryFilter}
              onValueChange={setSelectedCategoryFilter}
            >
              <SelectTrigger id="cat-filter" className="w-[180px]" size="sm">
                <SelectValue placeholder="كل الأقسام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأقسام ({dishes.length})</SelectItem>
                {categories.map((cat) => {
                  const count = dishes.filter((d) => d.categoryId === cat.id).length;
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nameAr} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dishes Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">جاري تحميل قائمة الأطباق...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 p-12 text-center">
            <UtensilsCrossed className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 font-medium text-foreground">
              {dishes.length === 0
                ? "لا توجد أطباق مسجلة في قاعدة البيانات حالياً."
                : "لا توجد أطباق مطابقة للبحث أو القسم المحدد."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {dishes.length === 0
                ? "يمكنك إضافة طبق جديد أو الضغط على 'استيراد القائمة التأسيسية'."
                : "جرب تغيير مصطلح البحث أو اختيار قسم آخر."}
            </p>
            {dishes.length === 0 && (
              <div className="mt-4 flex justify-center gap-3">
                <Button onClick={handleSeedMenu} disabled={seeding} variant="outline" size="sm">
                  <Sparkles className="size-4 text-primary" />
                  استيراد القائمة التأسيسية
                </Button>
                <Button onClick={openAddDialog} size="sm">
                  <Plus className="size-4" />
                  إضافة طبق يدوي
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[80px]">الصورة</TableHead>
                  <TableHead>اسم الطبق</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead className="hidden md:table-cell">الوصف</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDishes.map((dish) => (
                  <TableRow key={dish.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      {dish.imageUrl ? (
                        <div className="size-12 overflow-hidden rounded-md border border-border/60 bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={dish.imageUrl}
                            alt={dish.nameAr}
                            className="size-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-md border border-border/40 bg-muted/60 text-muted-foreground">
                          <ImageIcon className="size-5 opacity-40" />
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-foreground">{dish.nameAr}</div>
                      {dish.nameEn && (
                        <div className="text-xs text-muted-foreground">{dish.nameEn}</div>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {getCategoryName(dish)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-serif font-semibold text-foreground">
                        {dish.price != null ? `${dish.price} ر.س` : "—"}
                      </span>
                    </TableCell>

                    <TableCell className="hidden max-w-[220px] truncate text-xs text-muted-foreground md:table-cell">
                      {dish.description ?? "—"}
                    </TableCell>

                    <TableCell className="text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(dish)}
                          title="تعديل الطبق"
                          className="hover:border-primary/40 hover:text-primary"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteId(dish.id)}
                          title="حذف الطبق"
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
          <span>إجمالي الأطباق المعروضة: {filteredDishes.length} من {dishes.length}</span>
        </div>
      </CardContent>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg border-primary/30 bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <UtensilsCrossed className="size-5 text-primary" />
              {editingDish ? "تعديل بيانات الطبق" : "إضافة طبق جديد للقائمة"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dish-name">
                  اسم الطبق بالعربية <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dish-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: ستيك فيليه بلاك أنجوس"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dish-category">
                  القسم <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm({ ...form, categoryId: v })}
                >
                  <SelectTrigger id="dish-category" className="w-full">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dish-price">السعر (ر.س)</Label>
              <Input
                id="dish-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="مثال: 120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dish-image">رابط الصورة (URL)</Label>
              <Input
                id="dish-image"
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
              {/* Image Live Preview */}
              {form.imageUrl.trim() && (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-2">
                  <div className="size-16 overflow-hidden rounded-md border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imageUrl}
                      alt="معاينة الصورة"
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">معاينة الصورة</p>
                    <p className="truncate max-w-[280px]">{form.imageUrl}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dish-desc">الوصف ومكونات الطبق</Label>
              <Textarea
                id="dish-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="وصف مختصر لمكونات الطبق وطريقة تحضيره الفاخرة..."
                rows={3}
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : editingDish ? (
                "حفظ التعديلات"
              ) : (
                "إضافة الطبق"
              )}
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
              تأكيد حذف الطبق
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من رغبتك في حذف هذا الطبق نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.
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
                "نعم، احذف الطبق"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
