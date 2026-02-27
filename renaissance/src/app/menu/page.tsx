import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DishFlipCard } from "@/components/ui/dish-flip-card";
import MENU_CATEGORIES from "@/data/menu";

export default function MenuPage() {
  return (
    <div className="container px-4 py-12 md:px-6">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-3xl font-semibold text-primary md:text-4xl">
          Menu
        </h1>
        <p className="mt-2 text-muted-foreground">
          Starters, main courses, desserts and drinks
        </p>
      </header>

      <div className="space-y-16">
        {MENU_CATEGORIES.map((category) => (
          <section key={category.id}>
            <h2 className="font-serif text-2xl font-semibold text-primary mb-8 border-b border-border/40 pb-2 flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent to-primary/60 w-12" />
              {category.name}
              <div className="h-px bg-gradient-to-r from-primary/60 to-transparent flex-1" />
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
          </section>
        ))}
      </div>

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
