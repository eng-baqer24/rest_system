"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DishFlipCard } from "@/components/ui/dish-flip-card";

const dishes = [
  {
    name: "Oysters Rockefeller",
    description:
      "Fresh oysters with cream sauce and spinach, elegantly presented.",
    image:
      "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: "145",
    ingredients: [
      "Sea oysters",
      "Fresh cream",
      "Organic spinach",
      "Garlic and spices",
    ],
  },
  {
    name: "Filet Mignon Steak",
    description:
      "Premium beef with black pepper sauce and mashed potatoes.",
    image:
      "https://images.pexels.com/photos/2098110/pexels-photo-2098110.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: "280",
    ingredients: [
      "Angus beef",
      "Smoked black pepper",
      "Truffle butter",
      "Mashed potatoes",
    ],
  },
  {
    name: "Chocolate Fondant",
    description:
      "Warm chocolate cake with fresh berries and vanilla ice cream.",
    image:
      "https://images.pexels.com/photos/5107181/pexels-photo-5107181.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: "85",
    ingredients: [
      "Belgian chocolate",
      "Fresh berries",
      "Madagascar vanilla ice cream",
      "Gold flakes",
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function FeaturedDishes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="relative py-16 md:py-24">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-divider-shine" />
      <div className="container px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl font-semibold text-primary text-center md:text-4xl"
        >
          Signature Dishes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mx-auto mt-2 max-w-xl text-center text-muted-foreground"
        >
          We select the finest from our kitchen for you
        </motion.p>
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {dishes.map((dish) => (
            <motion.div key={dish.name} variants={cardItem}>
              <DishFlipCard
                name={dish.name}
                description={dish.description}
                image={dish.image}
                price={dish.price ? `$${dish.price}` : undefined}
                ingredients={dish.ingredients}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
