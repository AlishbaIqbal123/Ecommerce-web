'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Store, ShieldCheck, TrendingUp, Globe } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function VendorRegistrationPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '',
        businessEmail: '',
        businessPhone: '',
        businessAddress: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            // Create vendor request
            const { createVendor } = await import('@/lib/firebase/firestore');
            await createVendor({
                ...formData,
                userId: user?.id,
                businessAddress: {
                    city: formData.businessAddress,
                    // Fill other fields with placeholders for now
                    firstName: user?.displayName?.split(' ')[0] || '',
                    lastName: user?.displayName?.split(' ')[1] || '',
                    address1: '',
                    postalCode: '',
                    country: '',
                    phone: formData.businessPhone
                }
            });

            toast.success('Registration submitted! We will review your application.');
            router.push('/profile');
        } catch (error) {
            toast.error('Failed to submit registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="container-elegant py-12 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-gold-100/10 text-gold-100 hover:bg-gold-100/20 border-gold-100/20 px-4 py-1">
                            Partner with NoorMarket
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
                            Grow Your Business with Us
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of vendors reaching millions of customers worldwide. Sell your premium products on the leading ethical marketplace.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Benefits */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-heading font-medium">Why sell with NoorMarket?</h2>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-beige-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-6 h-6 text-gold-100" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Scale Your Reach</h3>
                                        <p className="text-sm text-muted-foreground">Access a global audience of conscious consumers looking for authentic, premium products.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-beige-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-gold-100" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Secure & Trusted</h3>
                                        <p className="text-sm text-muted-foreground">Benefit from our secure payment processing and built-in buyer protection tools.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-beige-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-6 h-6 text-gold-100" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Simple Logistics</h3>
                                        <p className="text-sm text-muted-foreground">Easily manage your inventory, orders, and shipping through our intuitive vendor dashboard.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gold-100/5 rounded-2xl border border-gold-100/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Store className="w-5 h-5 text-gold-100" />
                                    <span className="font-medium">Ready to start?</span>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    "NoorMarket has helped us double our sales in just 6 months. The support and community are unmatched." — Islamic Treasures Co.
                                </p>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <div className="bg-white p-8 rounded-2xl border border-beige-200 shadow-sm shadow-beige-100">
                            <h2 className="text-xl font-medium mb-6">Business Application</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input
                                        id="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g. Modern Modest Boutique"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessEmail">Business Email</Label>
                                    <Input
                                        id="businessEmail"
                                        type="email"
                                        value={formData.businessEmail}
                                        onChange={handleChange}
                                        placeholder="sales@business.com"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessPhone">Phone Number</Label>
                                        <Input
                                            id="businessPhone"
                                            value={formData.businessPhone}
                                            onChange={handleChange}
                                            placeholder="+1..."
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="businessAddress">City / Region</Label>
                                        <Input
                                            id="businessAddress"
                                            value={formData.businessAddress}
                                            onChange={handleChange}
                                            placeholder="e.g. London, UK"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Tell us about your products</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="What makes your brand unique?"
                                        className="min-h-[100px]"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : 'Submit Application'}
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-4">
                                    By submitting, you agree to our Vendor Terms of Service and Privacy Policy.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function Badge({ children, className }: any) {
    return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
            {children}
        </span>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
