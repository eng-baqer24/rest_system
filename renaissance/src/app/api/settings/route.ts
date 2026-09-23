import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface RestaurantSettings {
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

declare global {
  var __renaissance_settings: RestaurantSettings | undefined;
}

const defaultSettings: RestaurantSettings = {
  restaurantName: "Renaissance",
  tagline: "An Unforgettable Fine Dining Experience",
  isAcceptingBookings: true,
  openingHours: "5:00 PM – 11:00 PM",
  operatingDays: "Daily (Monday – Sunday)",
  phone: "01234567889",
  email: "reservations@renaissance.com",
  address: "Golden Avenue, Baghdad",
  maxGuestsPerSlot: 40,
  autoConfirm: false,
  announcementText: "نرحب بكم في رينيسانس — تجربة طعام استثنائية. يُرجى الحجز المسبق لضمان اختيار طاولتكم المفضلة.",
  showAnnouncement: true,
  currency: "USD ($)",
  updatedAt: new Date().toISOString(),
};

if (!globalThis.__renaissance_settings) {
  globalThis.__renaissance_settings = { ...defaultSettings };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: globalThis.__renaissance_settings || defaultSettings,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    globalThis.__renaissance_settings = {
      ...(globalThis.__renaissance_settings || defaultSettings),
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "تم حفظ إعدادات الموقع والمطعم بنجاح",
      settings: globalThis.__renaissance_settings,
    });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
