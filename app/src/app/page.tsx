'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from 'lucide-react';
import { useProductStore } from '@/store';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const HERO_SLIDES = [
    {
        image: "/images/categories/home-decor.jpg",
        title: "Artisanal Home Decor",
        subtitle: "Traditional Islamic calligraphy and intricate lanterns to bring warmth to your home.",
        badge: "Home Collection"
    },
    {
        image: "/images/categories/prayer-essentials.jpg",
        title: "Prayer Essentials",
        subtitle: "Experience tranquility with our hand-picked velvet prayer mats and premium tasbihs.",
        badge: "Faith & Spirit"
    },
    {
        image: "/images/categories/modest-fashion.jpg",
        title: "Abayas & Modest Wear",
        subtitle: "Graceful full-coverage abayas and open suits designed for the modern woman of faith.",
        badge: "Modest Fashion"
    },
    {
        image: "/images/categories/gifts.jpg",
        title: "Islamic Gifts",
        subtitle: "Perfectly curated gift sets and seasonal treasures for your loved ones.",
        badge: "Thoughtful Giving"
    }
];

function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 6000); // 6 seconds for better viewing
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-charcoal-300">
            {/* Carousel Background Images */}
            {HERO_SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    <div className="relative w-full h-full overflow-hidden">
                        <div
                            className={cn(
                                "absolute inset-0 transition-transform duration-[6000ms] ease-linear",
                                index === currentSlide ? "scale-110 translate-x-10" : "scale-100 translate-x-0"
                            )}
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-100/90 via-charcoal-100/20 to-transparent" />
                    </div>
                </div>
            ))}

            <div className="container-elegant relative z-10">
                <div className="max-w-2xl text-white">
                    <div className="overflow-hidden">
                        <Badge
                            key={`badge-${currentSlide}`}
                            className="mb-4 bg-gold-100/20 text-gold-100 border-gold-100/30 animate-slide-up"
                        >
                            <Sparkles className="w-3 h-3 mr-1" />
                            {HERO_SLIDES[currentSlide].badge}
                        </Badge>
                    </div>

                    <h1
                        key={`title-${currentSlide}`}
                        className="text-5xl md:text-6xl lg:text-7xl font-heading font-semibold leading-tight mb-6 animate-slide-up"
                    >
                        {HERO_SLIDES[currentSlide].title.split(' ').map((word, i) => (
                            word === 'Heritage' || word === 'Essentials' || word === 'Fashion' ?
                                <span key={i} className="text-gold-100"> {word}</span> : i === 0 ? word : ` ${word}`
                        ))}
                    </h1>

                    <p
                        key={`subtitle-${currentSlide}`}
                        className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg animate-slide-up"
                    >
                        {HERO_SLIDES[currentSlide].subtitle}
                    </p>

                    <div className="flex flex-wrap gap-4 animate-slide-up">
                        <Button size="lg" className="bg-gold-100 hover:bg-gold-200 text-white" asChild>
                            <Link href="/shop">
                                Shop Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white text-charcoal-100 border-white hover:bg-beige-100 hover:text-charcoal-200" asChild>
                            <Link href="/categories">Explore Categories</Link>
                        </Button>
                    </div>

                    {/* Pagination Indicators */}
                    <div className="flex gap-2 mt-20">
                        {HERO_SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={cn(
                                    "h-1.5 transition-all duration-300 rounded-full",
                                    i === currentSlide ? "w-8 bg-gold-100" : "w-2 bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute bottom-10 right-10 hidden lg:block animate-bounce-slow">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Verified Vendors</p>
                            <p className="text-white/60 text-sm">Authentic Products</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Categories Section
function CategoriesSection() {
    const featuredCategories = PRODUCT_CATEGORIES.filter((cat) => cat.featured);

    return (
        <section className="section-padding bg-white">
            <div className="container-elegant">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-muted-foreground">
                        Browse our wide range of Islamic products organized by category
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {featuredCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.id}`}
                            className="group relative aspect-square rounded-xl overflow-hidden"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-100/80 via-charcoal-100/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <h3 className="text-white font-medium text-lg md:text-xl mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-white/70 text-sm hidden md:block">
                                    {category.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Featured Products Section
function FeaturedProductsSection() {
    const { featuredProducts, fetchFeaturedProducts, isLoading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <section className="section-padding">
            <div className="container-elegant">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
                            Featured Selection
                        </h2>
                        <p className="text-muted-foreground">
                            Handpicked premium treasures for you
                        </p>
                    </div>
                    <Button variant="outline" asChild className="hidden sm:flex">
                        <Link href="/shop?featured=true">
                            View All
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <ProductGrid products={featuredProducts} isLoading={isLoading} columns={4} />
            </div>
        </section>
    );
}

// New Arrivals Section
function NewArrivalsSection() {
    const { products, fetchProducts, isLoading } = useProductStore();

    useEffect(() => {
        fetchProducts(true);
    }, [fetchProducts]);

    // Show only the 4 most recent products
    const recentProducts = products.slice(0, 4);

    return (
        <section className="section-padding bg-beige-100/30">
            <div className="container-elegant">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
                            New Arrivals
                        </h2>
                        <p className="text-muted-foreground">
                            The latest additions to our curated marketplace
                        </p>
                    </div>
                    <Button variant="outline" asChild className="hidden sm:flex">
                        <Link href="/shop">
                            Explore Shop
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <ProductGrid products={recentProducts} isLoading={isLoading} columns={4} />

                <div className="mt-8 text-center sm:hidden">
                    <Button variant="outline" asChild>
                        <Link href="/shop">View All Products</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

// Features Section
function FeaturesSection() {
    const features = [
        {
            icon: Truck,
            title: 'Free Shipping',
            description: 'On orders over $75',
        },
        {
            icon: Shield,
            title: 'Secure Payment',
            description: '100% secure checkout',
        },
        {
            icon: RotateCcw,
            title: 'Easy Returns',
            description: '30-day return policy',
        },
    ];

    return (
        <section className="section-padding bg-white">
            <div className="container-elegant">
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-6 bg-cream-100 rounded-xl"
                        >
                            <div className="w-14 h-14 bg-gold-100/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <feature.icon className="w-6 h-6 text-gold-100" />
                            </div>
                            <div>
                                <h3 className="font-medium text-lg">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Newsletter Section
function NewsletterSection() {
    return (
        <section className="section-padding">
            <div className="container-elegant">
                <div className="bg-charcoal-100 rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-100 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-100 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-white mb-4">
                            Subscribe to Our Newsletter
                        </h2>
                        <p className="text-white/70 mb-8">
                            Get exclusive offers, new product alerts, and Islamic inspiration
                            delivered to your inbox.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold-100"
                            />
                            <Button size="lg" className="bg-gold-100 hover:bg-gold-200 text-white">
                                Subscribe
                            </Button>
                        </form>

                        <p className="text-white/50 text-sm mt-4">
                            By subscribing, you agree to our Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <div className="animate-fade-in">
            <HeroSection />
            <CategoriesSection />
            <FeaturedProductsSection />
            <NewArrivalsSection />
            <FeaturesSection />
            <NewsletterSection />
        </div>
    );
}
