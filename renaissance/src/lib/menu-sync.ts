import MENU_CATEGORIES from "@/data/menu";
import { prisma } from "@/lib/prisma";
import type { Dish, DishCategory } from "@prisma/client";

export type DishWithCategory = Dish & { category: DishCategory | null };

export function serializeDish(dish: DishWithCategory) {
  return {
    id: dish.id,
    nameAr: dish.nameAr,
    nameEn: dish.nameEn,
    description: dish.description,
    price: dish.price != null ? Number(dish.price) : null,
    imageUrl: dish.imageUrl,
    categoryId: dish.categoryId,
    sortOrder: dish.sortOrder,
    isFeatured: dish.isFeatured,
    dish_categories: dish.category
      ? {
          id: dish.category.id,
          nameAr: dish.category.nameAr,
          nameEn: dish.category.nameEn,
        }
      : null,
  };
}

export function staticMenuPayload() {
  return MENU_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    items: cat.items.map((item) => ({
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price,
    })),
  }));
}

export async function ensureMenuSeeded() {
  const categoryCount = await prisma.dishCategory.count();
  if (categoryCount === 0) {
    for (const [i, cat] of MENU_CATEGORIES.entries()) {
      await prisma.dishCategory.create({
        data: {
          id: cat.id,
          nameAr: cat.name,
          nameEn: cat.name,
          sortOrder: i,
          items: {
            create: cat.items.map((item, j) => ({
              nameAr: item.name,
              nameEn: item.name,
              description: item.description,
              price: item.price ? Number(item.price) : null,
              imageUrl: item.image,
              sortOrder: j,
              isFeatured: i === 1 && j < 2,
            })),
          },
        },
      });
    }
    return;
  }

  const dishCount = await prisma.dish.count();
  if (dishCount > 0) return;

  const categories = await prisma.dishCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });

  for (const cat of categories) {
    const source = MENU_CATEGORIES.find(
      (c) => c.id === cat.id || c.name === cat.nameAr || c.name === cat.nameEn
    );
    if (!source) continue;

    await prisma.dish.createMany({
      data: source.items.map((item, j) => ({
        categoryId: cat.id,
        nameAr: item.name,
        nameEn: item.name,
        description: item.description,
        price: item.price ? Number(item.price) : null,
        imageUrl: item.image,
        sortOrder: j,
      })),
    });
  }
}
