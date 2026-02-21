'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, useOrderStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Package, User, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
    const { user, logout, updateProfile } = useAuthStore();
    const { orders, fetchUserOrders, isLoading: ordersLoading } = useOrderStore();
    const router = useRouter();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setPhotoURL(user.photoURL || '');
            fetchUserOrders(user.id);
        }
    }, [user, fetchUserOrders]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await updateProfile({ displayName, photoURL });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSignOut = async () => {
        await logout();
        router.push('/');
        toast.success('Signed out successfully');
    };

    return (
        <ProtectedRoute>
            <div className="container-elegant py-8 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-4">
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6 flex flex-col items-center">
                            <div className="w-20 h-20 bg-gold-100/10 rounded-full flex items-center justify-center mb-4">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-gold-100" />
                                )}
                            </div>
                            <h2 className="font-heading font-semibold text-center">{user?.displayName || 'User'}</h2>
                            <p className="text-xs text-muted-foreground break-all text-center">{user?.email}</p>
                        </div>

                        <div className="bg-white rounded-xl border border-beige-200/50 overflow-hidden">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Tabs defaultValue="orders">
                            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
                                <TabsTrigger
                                    value="orders"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent py-3 px-0 font-heading font-medium"
                                >
                                    My Orders
                                </TabsTrigger>
                                <TabsTrigger
                                    value="settings"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent py-3 px-0 font-heading font-medium"
                                >
                                    Profile Settings
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders" className="py-6 min-h-[400px]">
                                {ordersLoading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <div className="animate-spin w-8 h-8 border-2 border-gold-100 border-t-transparent rounded-full" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12 bg-beige-100/30 rounded-xl border border-dashed border-beige-300">
                                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                                        <p className="text-sm text-muted-foreground mb-6">Looks like you haven't placed any orders yet.</p>
                                        <Button asChild variant="outline">
                                            <Link href="/shop">Explore Products</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-white rounded-xl border border-beige-200/50 overflow-hidden hover:border-beige-300 transition-colors">
                                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                                        <p className="text-xs text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                                        <Badge className={cn(
                                                            'mt-1',
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-beige-100 text-charcoal-100'
                                                        )}>
                                                            {order.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-lg font-semibold">{formatCurrency(order.total)}</p>
                                                        <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                                                        <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-gold-100" asChild>
                                                            <Link href={`/orders/${order.id}`}>
                                                                View Details
                                                                <ExternalLink className="w-3 h-3 ml-1" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="settings" className="py-6">
                                <div className="max-w-md">
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" value={user?.email || ''} disabled className="bg-beige-100/50" />
                                            <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Your Full Name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="photoURL">Profile Picture URL</Label>
                                            <Input
                                                id="photoURL"
                                                value={photoURL}
                                                onChange={(e) => setPhotoURL(e.target.value)}
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>

                                        <Button type="submit" disabled={isUpdating || (displayName === user?.displayName && photoURL === user?.photoURL)}>
                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </form>

                                    <Separator className="my-10" />

                                    <div className="p-6 rounded-xl bg-red-50 border border-red-100">
                                        <h3 className="text-red-800 font-medium mb-2">Danger Zone</h3>
                                        <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                        <Button variant="destructive" size="sm">Delete Account</Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
