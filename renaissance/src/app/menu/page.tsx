"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DishFlipCard } from "@/components/ui/dish-flip-card";
import MENU_CATEGORIES from "@/data/menu";
import { cn } from "@/lib/utils";

interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  isAvailable?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [selectedId, setSelectedId] = useState<string>(MENU_CATEGORIES[0].id);

  useEffect(() => {
    // Load dynamic menu items from API
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic menu:", err);
      }
    }
    loadMenu();
  }, []);

  const category = categories.find((c) => c.id === selectedId) || categories[0];

  return (
    <div className="container px-4 py-8 md:px-6">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-semibold text-primary md:text-4xl">
          Menu
        </h1>
        <p className="mt-2 text-muted-foreground">
          اختر الصنف ثم تصفح المنتجات
        </p>
      </header>

      {/* اختيارات الأصناف */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedId(cat.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all border",
              selectedId === cat.id
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* منتجات الصنف المختار */}
      <AnimatePresence mode="wait">
        {category && (
          <motion.section
            key={selectedId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <h2 className="font-serif text-xl font-semibold text-primary border-b border-border/40 pb-2 flex items-center gap-3">
              <span className="h-px bg-primary/60 w-8" />
              {category.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <div key={item.id || item.name} className="relative group">
                  <DishFlipCard
                    name={item.name}
                    description={item.description}
                    image={item.image}
                    price={item.price ? `$${item.price}` : undefined}
                  />
                  {item.isAvailable === false && (
                    <div className="absolute top-3 left-3 z-10 bg-rose-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                      نفذ مؤقتاً
                    </div>
                  )}
                  {item.badge && item.isAvailable !== false && (
                    <div className="absolute top-3 left-3 z-10 bg-amber-500 text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                      {item.badge}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="mt-16 rounded-lg border border-primary/30 bg-card/50 p-8 text-center">
        <h3 className="font-serif text-xl font-semibold text-primary">
          Tasting Menu
        </h3>
        <p className="mt-2 text-muted-foreground">
          A multi-course tasting experience curated by the chef. For enquiries and reservations, please contact us.
        </p>
      </section>
    </div>
  );
}
