"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Tag,
  DollarSign,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Flame,
  Check,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItem, MenuCategory } from "@/app/api/menu/route";

// Curated high quality food images library for 1-click selection
const PRESET_FOOD_IMAGES = [
  {
    label: "ستيك فاخر (Filet Mignon)",
    url: "https://images.pexels.com/photos/2098110/pexels-photo-2098110.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "سلمون مشوي (Grilled Salmon)",
    url: "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "ريزوتو بالمشروم (Risotto)",
    url: "https://images.pexels.com/photos/4103375/pexels-photo-4103375.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "ريش غنم (Lamb Chops)",
    url: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "برغر الذواقة (Gourmet Burger)",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  },
  {
    label: "باستا إيطالية (Truffle Pasta)",
    url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281223?w=600&q=80",
  },
  {
    label: "سلطة كينوا ورمان (Salad)",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  },
  {
    label: "شوربة فطر كريمية (Soup)",
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  },
  {
    label: "بروسكيتا إيطالية (Bruschetta)",
    url: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "تشيز كيك بالتوت (Cheesecake)",
    url: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "تيراميسو فاخر (Tiramisu)",
    url: "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "فوندان الشوكولاتة (Fondant)",
    url: "https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "شاورما دجاج مميزة (Shawarma)",
    url: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "كوكتيل موخيتو منعش (Mojito)",
    url: "https://images.pexels.com/photos/4784/alcohol-bar-party-cocktail.jpg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "قهوة تركية / إسبريسو",
    url: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "أركيلة رينيسانس الملكية",
    url: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&q=80",
  },
];

interface MenuManagerProps {
  onShowToast: (message: string, type?: "success" | "error") => void;
}

export function MenuManager({ onShowToast }: MenuManagerProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    item: MenuItem;
    categoryId: string;
  } | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "mains",
    categoryName: "الطباق الرئيسية — Main Courses",
    price: "",
    description: "",
    image: "",
    badge: "",
    calories: "",
    isAvailable: true,
  });

  const [saving, setSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  // Load menu data from API
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/menu", { cache: "no-store" });
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        // Also cache locally
        localStorage.setItem("renaissance_menu_cache", JSON.stringify(data.categories));
      }
    } catch (err) {
      console.error("Failed to load menu:", err);
      // Try local storage
      const cached = localStorage.getItem("renaissance_menu_cache");
      if (cached) {
        try {
          setCategories(JSON.parse(cached));
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Filtered Dishes
  const filteredDishes = useMemo(() => {
    const list: { item: MenuItem; categoryId: string; categoryName: string }[] = [];

    categories.forEach((cat) => {
      if (selectedCategoryFilter !== "all" && cat.id !== selectedCategoryFilter) {
        return;
      }

      cat.items.forEach((item) => {
        const matchesSearch =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesSearch) {
          list.push({
            item,
            categoryId: cat.id,
            categoryName: cat.name,
          });
        }
      });
    });

    return list;
  }, [categories, selectedCategoryFilter, searchQuery]);

  // Open modal for new dish
  const handleOpenAddModal = (defaultCategory?: string) => {
    setEditingItem(null);
    setFormData({
      name: "",
      categoryId: defaultCategory || categories[0]?.id || "mains",
      categoryName: categories[0]?.name || "الطباق الرئيسية",
      price: "",
      description: "",
      image: PRESET_FOOD_IMAGES[0].url,
      badge: "",
      calories: "",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing dish
  const handleOpenEditModal = (item: MenuItem, categoryId: string) => {
    setEditingItem({ item, categoryId });
    setFormData({
      name: item.name,
      categoryId,
      categoryName: categories.find((c) => c.id === categoryId)?.name || "",
      price: item.price,
      description: item.description,
      image: item.image,
      badge: item.badge || "",
      calories: item.calories || "",
      isAvailable: item.isAvailable !== false,
    });
    setIsModalOpen(true);
  };

  // Submit Add or Edit
  const handleSubmitDish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      onShowToast("يرجى إدخال اسم الطبق", "error");
      return;
    }
    if (!formData.price.trim()) {
      onShowToast("يرجى إدخال سعر الطبق", "error");
      return;
    }

    setSaving(true);

    try {
      if (editingItem) {
        // Edit existing dish
        const res = await fetch("/api/menu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: editingItem.item.id || editingItem.item.name,
            categoryId: formData.categoryId,
            updatedData: {
              name: formData.name,
              description: formData.description,
              price: formData.price,
              image: formData.image || PRESET_FOOD_IMAGES[0].url,
              badge: formData.badge || undefined,
              calories: formData.calories || undefined,
              isAvailable: formData.isAvailable,
            },
          }),
        });
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
          localStorage.setItem("renaissance_menu_cache", JSON.stringify(data.categories));
          onShowToast(`تم تعديل الطبق "${formData.name}" بنجاح!`, "success");
          setIsModalOpen(false);
        } else {
          throw new Error(data.error || "Failed to update dish");
        }
      } else {
        // Add new dish
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: formData.categoryId,
            item: {
              name: formData.name,
              description: formData.description,
              price: formData.price,
              image: formData.image || PRESET_FOOD_IMAGES[0].url,
              badge: formData.badge || undefined,
              calories: formData.calories || undefined,
              isAvailable: formData.isAvailable,
            },
          }),
        });
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
          localStorage.setItem("renaissance_menu_cache", JSON.stringify(data.categories));
          onShowToast(`تمت إضافة الطبق الجديد "${formData.name}" بنجاح!`, "success");
          setIsModalOpen(false);
        } else {
          throw new Error(data.error || "Failed to add dish");
        }
      }
    } catch (err: any) {
      console.error("Save dish error:", err);
      onShowToast(err.message || "حدث خطأ أثناء حفظ الطبق", "error");
    } finally {
      setSaving(false);
    }
  };

  // Toggle dish availability (In Stock / Out of Stock)
  const handleToggleAvailability = async (item: MenuItem, categoryId: string) => {
    const newStatus = !(item.isAvailable !== false);
    try {
      // Optimistic update
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.map((i) =>
                  i.name === item.name || i.id === item.id
                    ? { ...i, isAvailable: newStatus }
                    : i
                ),
              }
            : cat
        )
      );

      const res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id || item.name,
          categoryId,
          updatedData: { isAvailable: newStatus },
        }),
      });
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        localStorage.setItem("renaissance_menu_cache", JSON.stringify(data.categories));
      }

      onShowToast(
        newStatus
          ? `الطبق "${item.name}" أصبح متاحاً الآن في المنيو`
          : `تم تعيين الطبق "${item.name}" كـ "غير متوفر مؤقتاً"`,
        "success"
      );
    } catch (e) {
      onShowToast("تعذر تحديث حالة التوفر", "error");
      fetchMenu();
    }
  };

  // Delete Dish
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/menu?id=${encodeURIComponent(itemToDelete.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
        localStorage.setItem("renaissance_menu_cache", JSON.stringify(data.categories));
        onShowToast(`تم حذف الطبق "${itemToDelete.name}" من القائمة`, "success");
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      onShowToast("تعذر حذف الطبق، يرجى المحاولة لاحقاً", "error");
    } finally {
      setItemToDelete(null);
    }
  };

  // Stats
  const totalDishes = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const availableDishes = categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.isAvailable !== false).length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 border border-border/80 rounded-2xl p-5 backdrop-blur-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-primary">
              إدارة قائمة الطعام (Menu Management)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              تفاعلي ومباشر
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            أضف وجبات جديدة، عدّل الأسعار والصور، وحدد الوجبات المتوفرة أو المنتهية لتظهر فوراً للزبائن
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMenu}
            disabled={loading}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleOpenAddModal()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 text-xs h-9 shadow-md shadow-primary/20"
          >
            <Plus className="size-4" />
            <span>إضافة طبق جديد</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card/40 border border-border/60 rounded-xl p-3.5">
          <div className="text-xs text-muted-foreground">إجمالي الأصناف بالمنيو</div>
          <div className="text-xl font-bold text-foreground font-mono mt-0.5">{totalDishes}</div>
        </div>
        <div className="bg-card/40 border border-border/60 rounded-xl p-3.5">
          <div className="text-xs text-emerald-400">الأطباق المتاحة للطلب</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{availableDishes}</div>
        </div>
        <div className="bg-card/40 border border-border/60 rounded-xl p-3.5">
          <div className="text-xs text-amber-400">نفذت مؤقتاً (غير متوفر)</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
            {totalDishes - availableDishes}
          </div>
        </div>
        <div className="bg-card/40 border border-border/60 rounded-xl p-3.5">
          <div className="text-xs text-muted-foreground">عدد الأقسام والتصنيفات</div>
          <div className="text-xl font-bold text-primary font-mono mt-0.5">{categories.length}</div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategoryFilter === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card/80 text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            الكل ({totalDishes})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategoryFilter === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card/80 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {cat.name.split("—")[0].trim()} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="بحث عن طبق أو مكون..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8 pl-3 h-8 text-xs bg-background/70 border-border/70 text-right"
          />
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">جاري تحميل أطباق المنيو...</p>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl bg-card/20 space-y-3">
          <UtensilsCrossed className="size-10 text-muted-foreground/50 mx-auto" />
          <div className="text-sm font-semibold text-foreground">لا توجد أطباق مطابقة</div>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery
              ? `لم يتم العثور على أي طبق يطابق كلمة "${searchQuery}"`
              : "هذا القسم فارغ حالياً، يمكنك إضافة طبق جديد الآن"}
          </p>
          <Button
            size="sm"
            onClick={() => handleOpenAddModal(selectedCategoryFilter !== "all" ? selectedCategoryFilter : undefined)}
            className="gap-1.5 text-xs bg-primary text-primary-foreground mt-2"
          >
            <Plus className="size-3.5" />
            <span>إضافة طبق الآن</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredDishes.map(({ item, categoryId, categoryName }) => {
              const isAvailable = item.isAvailable !== false;
              const itemId = item.id || item.name;

              return (
                <motion.div
                  key={itemId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative rounded-2xl border bg-card/70 overflow-hidden transition-all hover:border-primary/50 shadow-sm flex flex-col justify-between ${
                    !isAvailable ? "opacity-70 border-rose-500/30 bg-rose-950/5" : "border-border/70"
                  }`}
                >
                  {/* Dish Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-black/40">
                    <img
                      src={item.image || PRESET_FOOD_IMAGES[0].url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_FOOD_IMAGES[0].url;
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5">
                      {/* Availability Tag */}
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item, categoryId)}
                        title="انقر لتبديل التوفر"
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md transition-transform hover:scale-105 ${
                          isAvailable
                            ? "bg-emerald-500/90 text-white shadow-sm"
                            : "bg-rose-500/95 text-white shadow-sm"
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <span className="size-1.5 rounded-full bg-white animate-pulse" />
                            <span>متوفر</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3" />
                            <span>نفذ مؤقتاً</span>
                          </>
                        )}
                      </button>

                      {/* Custom Badge if any */}
                      {item.badge && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                          <Sparkles className="size-2.5" />
                          <span>{item.badge}</span>
                        </span>
                      )}
                    </div>

                    {/* Price in Bottom Right of Image */}
                    <div className="absolute bottom-2.5 right-3 font-serif text-lg font-bold text-primary flex items-baseline gap-0.5 drop-shadow-md">
                      <span>${item.price}</span>
                    </div>

                    {/* Category Name in Bottom Left */}
                    <div className="absolute bottom-2.5 left-3 text-[11px] text-white/80 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                      {categoryName.split("—")[0].trim()}
                    </div>
                  </div>

                  {/* Dish Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {item.description || "لا يوجد وصف مدخل لهذا الطبق."}
                      </p>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(item, categoryId)}
                          className="h-8 px-2.5 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1"
                        >
                          <Edit2 className="size-3.5" />
                          <span>تعديل</span>
                        </Button>

                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(item, categoryId)}
                          className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
                        >
                          {isAvailable ? "تعطيل التوفر" : "تفعيل التوفر"}
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setItemToDelete({
                            id: item.id || item.name,
                            name: item.name,
                          })
                        }
                        className="h-8 px-2 text-xs text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        title="حذف من المنيو"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT DISH ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl rounded-3xl border border-primary/40 bg-[#0f0f12] p-6 shadow-2xl my-8 text-foreground"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                    <UtensilsCrossed className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {editingItem ? "تعديل بيانات الطبق" : "إضافة وجبة أو طبق جديد للمنيو"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      سيظهر هذا الطبق مباشرة للزبائن في صفحة قائمة الطعام
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <XCircle className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitDish} className="space-y-4 pt-4">
                {/* Name & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground/90 flex items-center gap-1">
                      <span>اسم الطبق</span>
                      <span className="text-primary">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: ستيك واغيو الفاخر"
                      className="text-sm bg-black/40 border-border/70"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground/90 flex items-center gap-1">
                      <span>تصنيف الطبق (القسم)</span>
                      <span className="text-primary">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        const targetCat = categories.find((c) => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                          categoryName: targetCat?.name || e.target.value,
                        });
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-black/40 border border-border/70 text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#18181b] text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground/90 flex items-center gap-1">
                      <span>السعر ($ أو بالدينار)</span>
                      <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="text"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="مثال: 45 أو 60"
                        className="text-sm bg-black/40 border-border/70 pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground/90">
                      شارة تمييزية (Badge اختياري)
                    </label>
                    <select
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl bg-black/40 border border-border/70 text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="" className="bg-[#18181b]">بدون شارة</option>
                      <option value="توقيع الشيف" className="bg-[#18181b]">توقيع الشيف (Chef's Special)</option>
                      <option value="الأكثر طلباً" className="bg-[#18181b]">الأكثر طلباً (Best Seller)</option>
                      <option value="طبق جديد" className="bg-[#18181b]">طبق جديد (New)</option>
                      <option value="نباتي" className="bg-[#18181b]">نباتي (Vegetarian)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-semibold text-foreground/90">
                    وصف الطبق والمكونات
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="مكونات الطبق وطريقة التقديم المميزة..."
                    className="w-full p-3 rounded-xl bg-black/40 border border-border/70 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Image Section: URL + Presets */}
                <div className="space-y-2.5 text-right">
                  <label className="text-xs font-semibold text-foreground/90 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="size-3.5 text-primary" />
                      <span>رابط صورة الطبق (URL)</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      أو اختر صورة فورية من المعرض أدناه
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      dir="ltr"
                      className="text-xs bg-black/40 border-border/70 font-mono text-left flex-1"
                    />
                  </div>

                  {/* Live Preview Box */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/40 border border-border/50">
                    <div className="size-14 rounded-lg overflow-hidden shrink-0 bg-muted/40 relative border border-border">
                      <img
                        src={formData.image || PRESET_FOOD_IMAGES[0].url}
                        alt="معاينة"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_FOOD_IMAGES[0].url;
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed flex-1">
                      <div className="font-semibold text-foreground mb-0.5">معاينة الصورة الحالية</div>
                      <span>تأكد من وضوح الصورة وجاذبيتها للزبائن</span>
                    </div>
                  </div>

                  {/* 1-Click Quick Preset Selector */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] text-primary font-medium flex items-center gap-1">
                      <Sparkles className="size-3" />
                      <span>مكتبة صور عالية الدقة (انقر للاختيار الفوري):</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 scrollbar-thin">
                      {PRESET_FOOD_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: preset.url })}
                          className={`group relative rounded-lg overflow-hidden border aspect-video transition-all ${
                            formData.image === preset.url
                              ? "border-primary ring-2 ring-primary"
                              : "border-border/60 hover:border-primary/60 opacity-80 hover:opacity-100"
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                          {formData.image === preset.url && (
                            <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                              <Check className="size-3.5 text-white stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-border/50">
                  <div>
                    <div className="text-xs font-semibold text-foreground">حالة توفر الطبق</div>
                    <div className="text-[11px] text-muted-foreground">
                      إذا تم إيقافه، سيعلم الزبائن أن الطبق نفذ مؤقتاً
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="modalAvailability"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="size-4.5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/40">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 gap-2 text-xs"
                  >
                    {saving ? (
                      <>
                        <div className="size-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" />
                        <span>{editingItem ? "حفظ التعديلات" : "إضافة الطبق للمنيو"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border border-destructive/40 bg-[#0f0f12] p-5 shadow-2xl text-center space-y-4"
              dir="rtl"
            >
              <div className="size-12 rounded-full bg-destructive/15 border border-destructive/30 text-destructive flex items-center justify-center mx-auto">
                <AlertCircle className="size-6" />
              </div>

              <div>
                <h4 className="font-bold text-foreground text-base">هل أنت متأكد من حذف الطبق؟</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  سيتم حذف الطبق <strong className="text-foreground">"{itemToDelete.name}"</strong> نهائياً من قائمة طعام المطعم.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setItemToDelete(null)}
                  className="text-xs h-8 px-4"
                >
                  تراجع
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmDelete}
                  className="text-xs h-8 px-4 gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  <span>تأكيد الحذف</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UtensilsCrossed(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z" />
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
      <path d="m2.1 21.8 6.4-6.3" />
      <path d="m19 5-7 7" />
    </svg>
  );
}
