'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getVendorById, getProductsByVendor } from '@/lib/firebase/firestore';
import type { Vendor, Product } from '@/types';
import { Star, MapPin, Store, Package, Phone, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product/ProductCard';

interface VendorStorePageProps {
    params: Promise<{ id: string }>;
}

export default function VendorStorePage({ params }: VendorStorePageProps) {
    const { id } = use(params);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVendorData = async () => {
            setIsLoading(true);
            try {
                const vendorData = await getVendorById(id);
                if (vendorData) {
                    setVendor(vendorData);
                    const vendorProducts = await getProductsByVendor(id, 'active');
                    setProducts(vendorProducts);
                }
            } catch (error) {
                console.error('Error fetching vendor store:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendorData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="container-elegant section-padding animate-pulse">
                <div className="h-64 bg-beige-100 rounded-xl mb-8" />
                <div className="flex gap-8">
                    <div className="w-1/4 h-96 bg-beige-100 rounded-xl" />
                    <div className="flex-1 h-96 bg-beige-100 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="container-elegant section-padding text-center">
                <Store className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold mb-2">Vendor Not Found</h1>
                <p className="text-muted-foreground mb-6">The vendor you are looking for does not exist or has been removed.</p>
                <Button asChild>
                    <Link href="/vendors">All Vendors</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Banner Section */}
            <div className="h-64 md:h-80 relative overflow-hidden">
                <Image
                    src={vendor.banner || 'https://images.unsplash.com/photo-1590393080001-c60657eea523?w=1200&q=80'}
                    alt={vendor.businessName}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="container-elegant -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Info Card */}
                    <div className="w-full md:w-80 space-y-6">
                        <Card className="overflow-hidden border-beige-200/50">
                            <CardContent className="p-6">
                                <div className="flex justify-center -mt-16 mb-4">
                                    <div className="relative w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-xl bg-white">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={vendor.logo} />
                                            <AvatarFallback className="bg-gold-100 text-white text-3xl">
                                                {vendor.businessName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-heading font-bold mb-1">{vendor.businessName}</h1>
                                    <Badge variant="outline" className="border-gold-100 text-gold-200 bg-gold-100/5">
                                        Verified Store
                                    </Badge>
                                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                                        {vendor.vendorType && (
                                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                                                {vendor.vendorType}
                                            </Badge>
                                        )}
                                        {vendor.collaboratorStatus && (
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-sage-100 text-sage-200">
                                                {vendor.collaboratorStatus === 'Solo' ? 'You (Owner)' : vendor.collaboratorStatus}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Star className="w-5 h-5 text-gold-100 fill-gold-100" />
                                        <span className="font-semibold">{vendor.rating}</span>
                                        <span className="text-muted-foreground">({vendor.reviewCount} Ratings)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                        <span>{vendor.businessAddress.city}, {vendor.businessAddress.country}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                        <span>{products.length} Products</span>
                                    </div>
                                    {vendor.businessPhone && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-5 h-5 text-muted-foreground" />
                                            <span>{vendor.businessPhone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                        <span>{vendor.businessEmail}</span>
                                    </div>
                                </div>

                                <Button className="w-full mt-8" variant="outline">
                                    Message Vendor
                                </Button>
                            </CardContent>
                        </Card>

                        {/* About Card */}
                        <Card className="border-beige-200/50">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-3">About Store</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {vendor.description || 'No store description available.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        <Tabs defaultValue="products" className="w-full">
                            <TabsList className="bg-transparent border-b border-beige-200 w-full justify-start rounded-none h-auto p-0 gap-8">
                                <TabsTrigger
                                    value="products"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-4 font-semibold"
                                >
                                    Products
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-4 font-semibold"
                                >
                                    Reviews
                                </TabsTrigger>
                                <TabsTrigger
                                    value="policies"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-4 font-semibold"
                                >
                                    Shipping Policies
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="products" className="pt-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.length > 0 ? (
                                        products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center">
                                            <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                                            <p className="text-muted-foreground">This vendor hasn't uploaded any products yet.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
