"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DishFlipCard } from "@/components/ui/dish-flip-card";
import MENU_CATEGORIES from "@/data/menu";
import { cn } from "@/lib/utils";

type MenuItem = {
  name: string;
  description: string;
  image: string;
  price?: string;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [selectedId, setSelectedId] = useState<string>(MENU_CATEGORIES[0].id);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories?.length) {
          setCategories(data.categories);
          setSelectedId((current) =>
            data.categories.some((c: MenuCategory) => c.id === current)
              ? current
              : data.categories[0].id
          );
        }
      })
      .catch(() => {
        /* keep static fallback */
      });
  }, []);

  const category =
    categories.find((c) => c.id === selectedId) ?? categories[0];

  if (!category) return null;

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

      <AnimatePresence mode="wait">
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
              <DishFlipCard
                key={item.name}
                name={item.name}
                description={item.description}
                image={item.image}
                price={item.price ? `$${item.price}` : undefined}
              />
            ))}
          </div>
        </motion.section>
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
