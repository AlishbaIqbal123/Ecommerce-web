'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useVendorStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X, Package } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import Link from 'next/link';

export default function NewProductPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { currentVendor } = useVendorStore();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        inventory: '',
        categoryId: '',
        image: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, categoryId: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentVendor) return;

        setIsLoading(true);
        try {
            const { createDocument } = await import('@/lib/firebase/firestore');
            const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const productId = `prod_${Date.now()}`;

            const productData = {
                id: productId,
                vendorId: currentVendor.id,
                vendorName: currentVendor.businessName,
                name: formData.name,
                slug,
                description: formData.description,
                price: Number(formData.price),
                inventory: Number(formData.inventory),
                categoryId: formData.categoryId,
                images: [formData.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'],
                status: 'active',
                rating: 0,
                reviewCount: 0,
                salesCount: 0,
                viewsCount: 0,
                featured: false,
                tags: [],
            };

            await createDocument('products', productId, productData);
            toast.success('Product created successfully!');
            router.push('/vendor/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute requireVendor>
            <div className="container-elegant py-8 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/vendor/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gold-100/10 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-gold-100" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-heading font-semibold">Add New Product</h1>
                            <p className="text-muted-foreground">List a new item in your store</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Premium Silk Hijab"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Category</Label>
                                    <Select onValueChange={handleCategoryChange} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRODUCT_CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe your product details..."
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Pricing & Stock</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="inventory">Initial Inventory</Label>
                                        <Input
                                            id="inventory"
                                            type="number"
                                            value={formData.inventory}
                                            onChange={handleChange}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Product Image</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="image">Image URL</Label>
                                        <Input
                                            id="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                        />
                                        <p className="text-[10px] text-muted-foreground">
                                            For demo, please provide a direct image URL.
                                        </p>
                                    </div>
                                    {formData.image && (
                                        <div className="relative aspect-square rounded-lg overflow-hidden border border-beige-200">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Invalid+Image';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" asChild disabled={isLoading}>
                                <Link href="/vendor/dashboard">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
