'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Store, MapPin } from 'lucide-react';
import { useVendorStore } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function VendorsPage() {
    const { vendors, fetchVendors, isLoading } = useVendorStore();

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    return (
        <div className="container-elegant section-padding animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-semibold mb-4 text-gradient">Our Trusted Vendors</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Meet the artisans, scholars, and businesses that bring premium Islamic products to your doorstep.
                        We carefully vet every partner to ensure the highest standards of quality and authenticity.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-64 rounded-xl bg-beige-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {vendors.map((vendor) => (
                            <div key={vendor.id} className="bg-white rounded-xl border border-beige-200/50 overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                {/* Banner */}
                                <div className="h-32 relative overflow-hidden">
                                    <Image
                                        src={vendor.banner || 'https://images.unsplash.com/photo-1590393080001-c60657eea523?w=800&q=80'}
                                        alt={vendor.businessName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                    <div className="absolute inset-0 bg-charcoal-100/20" />
                                </div>

                                <div className="p-6 relative">
                                    {/* Logo */}
                                    <div className="absolute -top-12 left-6 border-4 border-white rounded-full overflow-hidden shadow-lg">
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={vendor.logo} />
                                            <AvatarFallback className="bg-gold-100 text-white text-xl">
                                                {vendor.businessName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="mt-8">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold">{vendor.businessName}</h3>
                                            <Badge variant="outline" className="border-gold-100 text-gold-200 bg-gold-100/5">
                                                Verified
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-gold-100 text-gold-100" />
                                                <span className="font-medium text-charcoal-100">{vendor.rating}</span>
                                                <span>({vendor.reviewCount} reviews)</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{vendor.businessAddress.city}, {vendor.businessAddress.country}</span>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                                            {vendor.description}
                                        </p>

                                        <div className="flex gap-3">
                                            <Button className="flex-1" asChild>
                                                <Link href={`/vendor/${vendor.id}`}>
                                                    Visit Store
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon">
                                                <Store className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
