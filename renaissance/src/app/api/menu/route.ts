import { NextRequest, NextResponse } from "next/server";
import MENU_CATEGORIES from "@/data/menu";

export const dynamic = "force-dynamic";

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  calories?: string;
  isAvailable?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

declare global {
  var __renaissance_menu_state: MenuCategory[] | undefined;
}

function getInitialMenu(): MenuCategory[] {
  return MENU_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    items: cat.items.map((item, idx) => ({
      ...item,
      id: `${cat.id}-${idx}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      isAvailable: true,
    })),
  }));
}

if (!globalThis.__renaissance_menu_state) {
  globalThis.__renaissance_menu_state = getInitialMenu();
}

// GET all menu categories and items
export async function GET() {
  return NextResponse.json({
    success: true,
    categories: globalThis.__renaissance_menu_state || getInitialMenu(),
  });
}

// POST: Add a new dish or update full menu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if replacing entire menu
    if (Array.isArray(body.categories)) {
      globalThis.__renaissance_menu_state = body.categories;
      return NextResponse.json({
        success: true,
        message: "تم تحديث القائمة بنجاح",
        categories: globalThis.__renaissance_menu_state,
      });
    }

    // Add single dish to a category
    const { categoryId, item } = body;
    if (!categoryId || !item?.name) {
      return NextResponse.json(
        { success: false, error: "الرجاء توفير اسم الطبق وتحديد الصنف" },
        { status: 400 }
      );
    }

    const currentMenu = globalThis.__renaissance_menu_state || getInitialMenu();
    let targetCat = currentMenu.find((c) => c.id === categoryId);

    const newItem: MenuItem = {
      id: item.id || `dish-${Date.now()}`,
      name: item.name,
      description: item.description || "",
      price: String(item.price || "0"),
      image:
        item.image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
      badge: item.badge || undefined,
      calories: item.calories || undefined,
      isAvailable: item.isAvailable !== false,
    };

    if (!targetCat) {
      // Create new category if doesn't exist
      targetCat = {
        id: categoryId,
        name: body.categoryName || categoryId,
        items: [newItem],
      };
      currentMenu.push(targetCat);
    } else {
      // Add to existing category
      targetCat.items.unshift(newItem);
    }

    globalThis.__renaissance_menu_state = currentMenu;

    return NextResponse.json({
      success: true,
      message: "تم إضافة الطبق بنجاح إلى المنيو",
      item: newItem,
      categories: currentMenu,
    });
  } catch (error) {
    console.error("Error in POST /api/menu:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إضافة الطبق" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing dish
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, categoryId, updatedData } = body;

    if (!itemId || !updatedData) {
      return NextResponse.json(
        { success: false, error: "معرّف الطبق وبيانات التعديل مطلوبة" },
        { status: 400 }
      );
    }

    const currentMenu = globalThis.__renaissance_menu_state || getInitialMenu();
    let found = false;

    for (const cat of currentMenu) {
      const idx = cat.items.findIndex(
        (i) => i.id === itemId || i.name === itemId
      );
      if (idx !== -1) {
        // If category changed, move item
        if (categoryId && categoryId !== cat.id) {
          const [removed] = cat.items.splice(idx, 1);
          const newCat = currentMenu.find((c) => c.id === categoryId);
          if (newCat) {
            newCat.items.push({ ...removed, ...updatedData });
          }
        } else {
          cat.items[idx] = { ...cat.items[idx], ...updatedData };
        }
        found = true;
        break;
      }
    }

    if (!found) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الطبق المحدد" },
        { status: 404 }
      );
    }

    globalThis.__renaissance_menu_state = currentMenu;

    return NextResponse.json({
      success: true,
      message: "تم تحديث بيانات الطبق بنجاح",
      categories: currentMenu,
    });
  } catch (error) {
    console.error("Error in PUT /api/menu:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء تعديل الطبق" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a dish
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: "معرف الطبق مطلوب" },
        { status: 400 }
      );
    }

    const currentMenu = globalThis.__renaissance_menu_state || getInitialMenu();
    let deleted = false;

    for (const cat of currentMenu) {
      const initialLength = cat.items.length;
      cat.items = cat.items.filter((i) => i.id !== itemId && i.name !== itemId);
      if (cat.items.length < initialLength) {
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الطبق" },
        { status: 404 }
      );
    }

    globalThis.__renaissance_menu_state = currentMenu;

    return NextResponse.json({
      success: true,
      message: "تم حذف الطبق من القائمة بنجاح",
      categories: currentMenu,
    });
  } catch (error) {
    console.error("Error in DELETE /api/menu:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء حذف الطبق" },
      { status: 500 }
    );
  }
}
