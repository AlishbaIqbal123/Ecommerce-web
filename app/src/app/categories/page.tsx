'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export default function CategoriesPage() {
    return (
        <div className="container-elegant section-padding animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">Browse Categories</h1>
                <p className="text-lg text-muted-foreground">
                    Discover our carefully curated collections of premium Islamic lifestyle products.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCT_CATEGORIES.map((category) => (
                    <Link
                        key={category.id}
                        href={`/shop?category=${category.id}`}
                        className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-100/90 via-charcoal-100/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white text-2xl font-heading font-semibold mb-2">
                                {category.name}
                            </h3>
                            <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {category.description}
                            </p>
                            <div className="mt-4 w-10 h-1 bg-gold-100 group-hover:w-full transition-all duration-500" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
