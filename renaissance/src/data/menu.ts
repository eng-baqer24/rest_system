// صور طعام فاخرة من Pexels - كل صورة مطابقة للطبق
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
        image: "https://images.pexels.com/photos/5419030/pexels-photo-5419030.jpeg?auto=compress&cs=tinysrgb&w=400",
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
    name: "Main Courses",
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
        image: "https://images.pexels.com/photos/555775/pexels-photo-555775.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Mushroom & Parmesan Risotto",
        description: "Arborio rice, mushrooms, parmesan, white wine.",
        price: "55",
        image: "https://images.pexels.com/photos/4103375/pexels-photo-4103375.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
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
        image: "https://images.pexels.com/photos/2159156/pexels-photo-2159156.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Soft Drinks & Water",
        description: "Selection of cold beverages.",
        price: "8",
        image: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
];

export default MENU_CATEGORIES;
