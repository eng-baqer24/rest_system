// أصناف القائمة — صور متناسقة مع اسم كل منتج
const MENU_CATEGORIES = [
  {
    id: "starters",
    name: "Starters",
    items: [
      {
        name: "Quinoa & Pomegranate Salad",
        description: "Quinoa, pomegranate, feta, fresh vegetables and lemon dressing.",
        price: "25",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      },
      {
        name: "Cream of Mushroom Soup",
        description: "Fresh mushrooms, cream, herbs.",
        price: "22",
        image: "https://images.pexels.com/photos/5394511/pexels-photo-5394511.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Bruschetta with Tomato & Basil",
        description: "Toasted bread, fresh tomato, mozzarella, basil.",
        price: "28",
        image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "mains",
    name: "الطباق الرئيسية — Main Courses",
    items: [
      {
        name: "Filet Mignon Steak",
        description: "Premium beef, black pepper sauce, mashed potatoes.",
        price: "95",
        image: "https://images.pexels.com/photos/2098110/pexels-photo-2098110.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Grilled Salmon with Vegetables",
        description: "Grilled salmon, asparagus, baby potatoes, lemon sauce.",
        price: "78",
        image: "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Mushroom & Parmesan Risotto",
        description: "Arborio rice, mushrooms, parmesan, white wine.",
        price: "55",
        image: "https://images.pexels.com/photos/4103375/pexels-photo-4103375.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Lamb Chops with Mint Jus",
        description: "Grilled lamb chops, mint jus, roasted vegetables.",
        price: "72",
        image: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Chicken Shawarma Plate",
        description: "Marinated chicken, garlic sauce, pickles, rice.",
        price: "38",
        image: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "desserts",
    name: "الحلويات — Desserts",
    items: [
      {
        name: "Chocolate Fondant",
        description: "Warm chocolate cake, vanilla ice cream, fresh berries.",
        price: "35",
        image: "https://images.pexels.com/photos/5107181/pexels-photo-5107181.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Classic Tiramisu",
        description: "Mascarpone, coffee, cocoa.",
        price: "32",
        image: "https://images.pexels.com/photos/1040685/pexels-photo-1040685.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Crème Brûlée",
        description: "Vanilla cream, caramelised sugar.",
        price: "28",
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Baklava",
        description: "Layered pastry with nuts and honey syrup.",
        price: "26",
        image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Kunafa",
        description: "Crispy pastry with sweet cheese and syrup.",
        price: "30",
        image: "https://images.pexels.com/photos/31500975/pexels-photo-31500975.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "hookahs",
    name: "الأراكيل — Hookahs",
    items: [
      {
        name: "Classic Double Apple",
        description: "Double apple flavour, traditional mix.",
        price: "45",
        image: "https://images.unsplash.com/photo-1685003227041-49af807c0113?w=400&q=80",
      },
      {
        name: "Mint & Lemon",
        description: "Refreshing mint with a touch of lemon.",
        price: "45",
        image: "https://images.unsplash.com/photo-1685003227041-49af807c0113?w=400&q=80",
      },
      {
        name: "Grape & Mint",
        description: "Sweet grape with fresh mint.",
        price: "48",
        image: "https://images.unsplash.com/photo-1685003227041-49af807c0113?w=400&q=80",
      },
      {
        name: "Blueberry",
        description: "Smooth blueberry flavour.",
        price: "48",
        image: "https://images.unsplash.com/photo-1685003227041-49af807c0113?w=400&q=80",
      },
      {
        name: "Premium Mix (Custom)",
        description: "Your choice of flavours combined.",
        price: "55",
        image: "https://images.unsplash.com/photo-1685003227041-49af807c0113?w=400&q=80",
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      {
        name: "Fresh Juices",
        description: "Orange, apple, carrot, pomegranate—seasonal selection.",
        price: "18",
        image: "https://images.pexels.com/photos/246120/pexels-photo-246120.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Espresso / Cappuccino",
        description: "Premium coffee from selected beans.",
        price: "12",
        image: "https://images.pexels.com/photos/3124181/pexels-photo-3124181.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Soft Drinks & Water",
        description: "Selection of cold beverages.",
        price: "8",
        image: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Arabic Coffee",
        description: "Cardamom-infused traditional coffee.",
        price: "14",
        image: "https://images.pexels.com/photos/3124181/pexels-photo-3124181.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Fresh Lemonade with Mint",
        description: "House-made lemonade with fresh mint.",
        price: "16",
        image: "https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
];

export default MENU_CATEGORIES;
