"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80";

interface DishFlipCardProps {
    name: string;
    description: string;
    image: string;
    price?: string;
    ingredients?: string[];
    className?: string;
}

export function DishFlipCard({
    name,
    description,
    image,
    price = "On request",
    ingredients = [],
    className,
}: DishFlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [imgSrc, setImgSrc] = useState(image);

    const handleImageError = () => {
        setImgSrc(FALLBACK_IMAGE);
    };

    return (
        <motion.div
            className={cn("group relative h-[400px] w-full perspective-1000", className)}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(!isFlipped)}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div
                className={cn(
                    "relative h-full w-full rounded-lg transition-all duration-700 transform-style-3d",
                    isFlipped ? "rotate-y-180" : ""
                )}
            >
                {/* Front of Card */}
                <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden border border-border bg-card shadow-lg">
                    <div className="relative h-2/3 w-full">
                        <Image
                            src={imgSrc}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={handleImageError}
                        />
                        {/* Dark gradient overlay on image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-card">
                        <h3 className="font-serif text-2xl font-bold text-primary">{name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 h-full w-full rounded-lg bg-card border border-primary/40 backface-hidden rotate-y-180 p-6 flex flex-col justify-center items-center text-center shadow-[0_0_30px_rgba(201,162,39,0.15)] overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-[100px] -z-10" />

                    <h3 className="font-serif text-2xl font-bold text-primary mb-4">{name}</h3>
                    <div className="w-12 h-px bg-primary/50 mb-6" />

                    <p className="text-secondary/90 text-sm leading-relaxed mb-6">
                        {description}
                    </p>

                    {ingredients.length > 0 && (
                        <div className="mb-6 w-full">
                            <h4 className="text-xs uppercase tracking-widest text-primary/70 mb-2">Ingredients & flavours</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                {ingredients.map((ing, idx) => (
                                    <li key={idx} className="flex justify-center items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-auto pt-4 w-full border-t border-border">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-muted-foreground">Price</span>
                            <span className="text-primary text-lg">{price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
