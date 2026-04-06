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
import { ArrowLeft, Upload, X, Package, Plus, Trash2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import Link from 'next/link';

export default function NewProductPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { currentVendor } = useVendorStore();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        inventory: '',
        categoryId: '',
        image: '',
    });
    
    // Dynamic specifications
    const [attributes, setAttributes] = useState<{ id: string, name: string, value: string }[]>([]);

    const addAttribute = () => {
        setAttributes([...attributes, { id: Date.now().toString(), name: '', value: '' }]);
    };

    const updateAttribute = (id: string, field: 'name' | 'value', val: string) => {
        setAttributes(attributes.map(attr => attr.id === id ? { ...attr, [field]: val } : attr));
    };

    const removeAttribute = (id: string) => {
        setAttributes(attributes.filter(attr => attr.id !== id));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            const newPreviewUrls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
            const { uploadImage } = await import('@/lib/firebase/storage');
            
            const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const productId = `prod_${Date.now()}`;
            
            // Upload all selected files
            const uploadedUrls: string[] = [];
            for (const file of selectedFiles) {
                const storagePath = `products/${currentVendor.id}/${productId}/${Date.now()}_${file.name}`;
                const url = await uploadImage(file, storagePath);
                uploadedUrls.push(url);
            }

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
                images: uploadedUrls.length > 0 ? uploadedUrls : [formData.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'],
                status: 'active',
                rating: 0,
                reviewCount: 0,
                salesCount: 0,
                viewsCount: 0,
                featured: false,
                tags: [],
            };
            
            const finalAttributes: Record<string, string> = {};
            attributes.forEach(attr => {
                if (attr.name.trim() && attr.value.trim()) {
                    finalAttributes[attr.name.trim()] = attr.value.trim();
                }
            });
            if (Object.keys(finalAttributes).length > 0) {
                (productData as any).attributes = finalAttributes;
            }

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
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Specifications & Attributes</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                                    <Plus className="w-4 h-4 mr-1" /> Add Detail
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {attributes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No specifications added. Click the button above to add details like "Format", "Size", "Material", etc.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {attributes.map((attr) => (
                                            <div key={attr.id} className="flex gap-2 items-start">
                                                <div className="grid grid-cols-2 gap-2 flex-1">
                                                    <Input
                                                        placeholder="e.g. Format"
                                                        value={attr.name}
                                                        onChange={(e) => updateAttribute(attr.id, 'name', e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="e.g. Digital PDF"
                                                        value={attr.value}
                                                        onChange={(e) => updateAttribute(attr.id, 'value', e.target.value)}
                                                    />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => removeAttribute(attr.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    <CardTitle className="text-lg">Product Media</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-beige-200 rounded-lg p-6 bg-beige-50/10 hover:bg-beige-50/20 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <Upload className="w-8 h-8 text-gold-100 mb-2" />
                                            <p className="text-sm font-medium">Click to upload images</p>
                                            <p className="text-xs text-muted-foreground mt-1">Upload primary cover and showcase images</p>
                                        </div>

                                        {previewUrls.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {previewUrls.map((url, index) => (
                                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-beige-100 group">
                                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        {index === 0 && (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gold-100/80 text-white text-[8px] py-0.5 text-center px-1">Cover</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-beige-100" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white px-2 text-muted-foreground">Or provide URL</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Input
                                                id="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" asChild disabled={isLoading}>
                                <Link href="/vendor/dashboard">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
