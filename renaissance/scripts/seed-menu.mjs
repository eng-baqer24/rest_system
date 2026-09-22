import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MENU_CATEGORIES = [
  {
    id: "starters",
    name: "المقبلات — Starters",
    items: [
      {
        name: "سلطة الكينوا والرمان",
        description: "كينوا، رمان، جبنة فيتا، خضار طازجة وتتبيلة الليمون الفاخرة.",
        price: 25,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      },
      {
        name: "شوربة كريمة الفطر البري",
        description: "فطر طازج، كريمة غنية، أعشاب إيطالية ونكهة الكمأة.",
        price: 22,
        image: "https://images.pexels.com/photos/5394511/pexels-photo-5394511.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "بروسكيتا الطماطم والريحان",
        description: "خبز محمص مقرمش، طماطم كرزية طازجة، جبنة موزاريلا وريحان.",
        price: 28,
        image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "mains",
    name: "الأطباق الرئيسية — Main Courses",
    items: [
      {
        name: "ستيك فيليه مينيون",
        description: "لحم أنجوس فاخر، صلصة الفلفل الأسود، بطاطس مهروسة بالزبدة.",
        price: 95,
        image: "https://images.pexels.com/photos/2098110/pexels-photo-2098110.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "سلمون مشوي مع الهليون",
        description: "فيليه سلمون طازج مشوي، هليون، بطاطس صغيرة وصلصة الليمون بالزبدة.",
        price: 78,
        image: "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "ريزوتو الفطر والبارميزان",
        description: "أرز أربوريو إيطالي، مزيج فطر غابي، جبنة بارميزان معتقة وزيت كمأة.",
        price: 55,
        image: "https://images.pexels.com/photos/4103375/pexels-photo-4103375.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "ريش لحم الضأن المشوية",
        description: "ريش ضأن طرية متبلة، صلصة النعناع، خضروات مشوية على الفحم.",
        price: 72,
        image: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "desserts",
    name: "الحلويات — Desserts",
    items: [
      {
        name: "فوندان الشوكولاتة البلجيكية",
        description: "كعكة شوكولاتة دافئة بقلب سائل، آيس كريم الفانيليا وتوت بري.",
        price: 35,
        image: "https://images.pexels.com/photos/5107181/pexels-photo-5107181.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "تيراميسو كلاسيكي",
        description: "جبنة ماسكاربوني غنية، قهوة إسبريسو إيطالية وبودرة الكاكاو الفاخر.",
        price: 32,
        image: "https://images.pexels.com/photos/1040685/pexels-photo-1040685.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "كنافة نابلسية بالجبن",
        description: "عجينة كنافة مقرمشة، جبنة عكاوية ذائبة، فستق حلبي وشيرة الزهر.",
        price: 30,
        image: "https://images.pexels.com/photos/31500975/pexels-photo-31500975.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "drinks",
    name: "المشروبات والقهوة — Drinks & Coffee",
    items: [
      {
        name: "عصير برتقال ورمان طازج",
        description: "عصير فواكه طازجة طبيعية 100% تُعصر عند الطلب.",
        price: 18,
        image: "https://images.pexels.com/photos/246120/pexels-photo-246120.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "إسبريسو / كابتشينو إيطالي",
        description: "قهوة مختصة محضرة من حبوب بن أرابيكا عالية الجودة.",
        price: 16,
        image: "https://images.pexels.com/photos/3124181/pexels-photo-3124181.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "ليموناضة بالنعناع المثلج",
        description: "ليمون طازج، نعناع بلدي، مكعبات ثلج منعشة.",
        price: 16,
        image: "https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
];

async function seed() {
  console.log("Seeding menu categories and dishes into Supabase PostgreSQL...");

  for (const [i, cat] of MENU_CATEGORIES.entries()) {
    const category = await prisma.dishCategory.upsert({
      where: { id: cat.id },
      update: { nameAr: cat.name, sortOrder: i },
      create: { id: cat.id, nameAr: cat.name, sortOrder: i },
    });

    console.log(`✓ Category: ${category.nameAr}`);

    for (const [j, item] of cat.items.entries()) {
      const existing = await prisma.dish.findFirst({
        where: { nameAr: item.name, categoryId: category.id },
      });

      if (!existing) {
        await prisma.dish.create({
          data: {
            nameAr: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.image,
            categoryId: category.id,
            sortOrder: j,
          },
        });
        console.log(`  + Added dish: ${item.name} (${item.price} SAR)`);
      } else {
        console.log(`  = Exists: ${item.name}`);
      }
    }
  }

  const [dishCount, catCount] = await Promise.all([
    prisma.dish.count(),
    prisma.dishCategory.count(),
  ]);

  console.log(`\n🎉 Seed finished! Total Categories: ${catCount}, Total Dishes: ${dishCount}`);
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
