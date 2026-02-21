'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    Plus,
    DollarSign,
    Star,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore, useVendorStore, useOrderStore } from '@/store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { toast } from 'sonner';

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function VendorDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user } = useAuthStore();
    const { currentVendor, vendorProducts, fetchVendorByUserId, fetchVendorProducts } = useVendorStore();
    const { orders, fetchVendorOrders } = useOrderStore();

    useEffect(() => {
        if (user) {
            fetchVendorByUserId(user.id).then((vendor) => {
                if (vendor) {
                    fetchVendorProducts(vendor.id);
                    fetchVendorOrders(vendor.id);
                }
            });
        }
    }, [user, fetchVendorByUserId, fetchVendorProducts, fetchVendorOrders]);

    if (!currentVendor) {
        return (
            <div className="container-elegant py-20 text-center">
                <h2 className="text-2xl font-heading font-semibold mb-4">You are not a registered vendor yet.</h2>
                <Button asChild>
                    <Link href="/vendor/register">Apply for Vendor Account</Link>
                </Button>
            </div>
        );
    }

    const stats = [
        { title: 'Total Revenue', value: formatCurrency(orders.reduce((acc, o) => acc + o.total, 0)), change: '+12%', icon: DollarSign },
        { title: 'Total Orders', value: orders.length.toString(), change: '+8%', icon: ShoppingCart },
        { title: 'Products', value: vendorProducts.length.toString(), change: '+3', icon: Package },
        { title: 'Rating', value: currentVendor.rating.toString(), change: '+0.2', icon: Star },
    ];

    const recentOrders = orders.slice(0, 5);
    const products = vendorProducts;

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const { deleteDocument } = await import('@/lib/firebase/firestore');
            await deleteDocument('products', productId);
            toast.success('Product deleted');
            if (currentVendor) fetchVendorProducts(currentVendor.id);
        } catch (e) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <ProtectedRoute requireVendor>
            <div className="container-elegant py-8 animate-fade-in">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-beige-200/50 p-4 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                            <div className="flex items-center gap-3 mb-6 p-2">
                                <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">V</span>
                                </div>
                                <div>
                                    <p className="font-medium">{currentVendor.businessName}</p>
                                    <p className="text-xs text-muted-foreground">{currentVendor.businessEmail}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                            activeTab === item.id
                                                ? 'bg-gold-100/10 text-gold-100'
                                                : 'hover:bg-beige-100 text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-heading font-semibold">
                                {sidebarItems.find((i) => i.id === activeTab)?.label}
                            </h1>
                            {activeTab === 'products' && (
                                <Button asChild>
                                    <Link href="/vendor/products/new">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Product
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Dashboard Content */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                {/* Stats */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.map((stat) => (
                                        <Card key={stat.title}>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                                        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                                                        <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-gold-100/10 rounded-full flex items-center justify-center">
                                                        <stat.icon className="w-5 h-5 text-gold-100" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Recent Orders */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Recent Orders</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-beige-200">
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentOrders.map((order: any) => (
                                                        <tr key={order.id} className="border-b border-beige-100">
                                                            <td className="py-3 px-4 text-sm">{order.id.slice(0, 8)}</td>
                                                            <td className="py-3 px-4 text-sm">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                                                            <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                            <td className="py-3 px-4 text-sm">{formatCurrency(order.total)}</td>
                                                            <td className="py-3 px-4">
                                                                <Badge
                                                                    variant={
                                                                        order.status === 'delivered'
                                                                            ? 'default'
                                                                            : order.status === 'shipped'
                                                                                ? 'secondary'
                                                                                : order.status === 'placed'
                                                                                    ? 'outline'
                                                                                    : 'destructive'
                                                                    }
                                                                    className="capitalize"
                                                                >
                                                                    {order.status}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Products Content */}
                        {activeTab === 'products' && (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-beige-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Inventory</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sales</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product) => (
                                                    <tr key={product.id} className="border-b border-beige-100">
                                                        <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                                                        <td className="py-3 px-4 text-sm">{formatCurrency(product.price)}</td>
                                                        <td className="py-3 px-4 text-sm">{product.inventory}</td>
                                                        <td className="py-3 px-4 text-sm">{(product as any).salesCount || 0}</td>
                                                        <td className="py-3 px-4">
                                                            <Badge
                                                                variant={product.status === 'active' ? 'default' : 'secondary'}
                                                                className="capitalize"
                                                            >
                                                                {product.status.replace('_', ' ')}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Edit className="w-4 h-4 mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Orders Content */}
                        {activeTab === 'orders' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Orders Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-beige-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current Status</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order: any) => (
                                                    <tr key={order.id} className="border-b border-beige-100">
                                                        <td className="py-3 px-4 text-sm font-mono">{order.id.slice(0, 8).toUpperCase()}</td>
                                                        <td className="py-3 px-4 text-sm">
                                                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm">{formatCurrency(order.total)}</td>
                                                        <td className="py-3 px-4">
                                                            <Badge className="capitalize">{order.status}</Badge>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex gap-2">
                                                                {order.status === 'placed' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={async () => {
                                                                            const { updateOrderStatus } = await import('@/lib/firebase/firestore');
                                                                            await updateOrderStatus(order.id, 'processing');
                                                                            fetchVendorOrders(currentVendor.id);
                                                                            toast.success('Order status updated');
                                                                        }}
                                                                    >
                                                                        Process
                                                                    </Button>
                                                                )}
                                                                {order.status === 'processing' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={async () => {
                                                                            const { updateOrderStatus } = await import('@/lib/firebase/firestore');
                                                                            await updateOrderStatus(order.id, 'shipped');
                                                                            fetchVendorOrders(currentVendor.id);
                                                                            toast.success('Order marked as shipped');
                                                                        }}
                                                                    >
                                                                        Ship
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Analytics Content */}
                        {activeTab === 'analytics' && (
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground text-center py-12">
                                        Detailed analytics coming soon...
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Settings Content */}
                        {activeTab === 'settings' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Business Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form className="space-y-6" onSubmit={async (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const data = {
                                            businessName: formData.get('businessName'),
                                            description: formData.get('description'),
                                            vendorType: formData.get('vendorType'),
                                            collaboratorStatus: formData.get('collaboratorStatus'),
                                            logo: formData.get('logo'),
                                            banner: formData.get('banner'),
                                        };
                                        try {
                                            const { updateDocument } = await import('@/lib/firebase/firestore');
                                            await updateDocument('vendors', currentVendor.id, data);
                                            toast.success('Settings updated');
                                            fetchVendorByUserId(user!.id);
                                        } catch (err) {
                                            toast.error('Failed to update settings');
                                        }
                                    }}>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="businessName">Business Name</Label>
                                                <Input id="businessName" name="businessName" defaultValue={currentVendor.businessName} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="vendorType">Vendor Type</Label>
                                                <Select name="vendorType" defaultValue={currentVendor.vendorType || 'Brand'}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Brand">Brand</SelectItem>
                                                        <SelectItem value="Maker">Maker</SelectItem>
                                                        <SelectItem value="Artisan">Artisan</SelectItem>
                                                        <SelectItem value="Curator">Curator</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="logo">Logo URL</Label>
                                                <Input id="logo" name="logo" defaultValue={currentVendor.logo} placeholder="https://..." />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="banner">Banner Image URL</Label>
                                                <Input id="banner" name="banner" defaultValue={currentVendor.banner} placeholder="https://..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="collaboratorStatus">Collaborator Status</Label>
                                            <Select name="collaboratorStatus" defaultValue={currentVendor.collaboratorStatus || 'Solo'}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Solo">Solo (You)</SelectItem>
                                                    <SelectItem value="Collaborator">Collaborator</SelectItem>
                                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Store Description</Label>
                                            <Textarea id="description" name="description" defaultValue={currentVendor.description} rows={4} />
                                        </div>
                                        <Button type="submit">Save Changes</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
