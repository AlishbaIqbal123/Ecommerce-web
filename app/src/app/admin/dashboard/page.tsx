'use client';

import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    CheckCircle,
    XCircle,
    DollarSign,
    Star,
    Trash2,
    ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { useVendorStore, useOrderStore } from '@/store';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const { vendors, fetchVendorsAdmin } = useVendorStore();
    const { orders, fetchAllOrders } = useOrderStore();

    useEffect(() => {
        fetchVendorsAdmin();
        fetchAllOrders();

        const loadAdminData = async () => {
            const { getAllUsers, getAllProductsAdmin } = await import('@/lib/firebase/firestore');
            const users = await getAllUsers();
            const products = await getAllProductsAdmin();
            setAllUsers(users);
            setAllProducts(products);
        };
        loadAdminData();
    }, [fetchVendorsAdmin, fetchAllOrders]);

    const stats = [
        { title: 'Total Revenue', value: formatCurrency(orders.reduce((acc: number, o: any) => acc + o.total, 0)), change: '+18%', icon: DollarSign },
        { title: 'Total Orders', value: orders.length.toString(), change: '+12%', icon: ShoppingCart },
        { title: 'Vendors', value: vendors.length.toString(), change: '+8', icon: Store },
        { title: 'Users', value: allUsers.length.toString(), change: '+245', icon: Users },
    ];

    const pendingVendors = vendors.filter(v => v.status === 'pending');
    const recentOrders = orders.slice(0, 5);

    const handleApproveVendor = async (vendorId: string) => {
        try {
            const { approveVendor } = await import('@/lib/firebase/firestore');
            await approveVendor(vendorId);
            toast.success('Vendor approved!');
            fetchVendorsAdmin();
        } catch (e) {
            toast.error('Approval failed');
        }
    };

    const handleRejectVendor = async (vendorId: string) => {
        try {
            const { rejectVendor } = await import('@/lib/firebase/firestore');
            await rejectVendor(vendorId);
            toast.success('Vendor rejected (suspended)');
            fetchVendorsAdmin();
        } catch (e) {
            toast.error('Rejection failed');
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
        try {
            const { deleteProductAdmin } = await import('@/lib/firebase/firestore');
            await deleteProductAdmin(productId);
            toast.success('Product deleted');
            const { getAllProductsAdmin } = await import('@/lib/firebase/firestore');
            const products = await getAllProductsAdmin();
            setAllProducts(products);
        } catch (e) {
            toast.error('Deletion failed');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            const { deleteUserAdmin } = await import('@/lib/firebase/firestore');
            await deleteUserAdmin(userId);
            toast.success('User deleted');
            const { getAllUsers } = await import('@/lib/firebase/firestore');
            const users = await getAllUsers();
            setAllUsers(users);
        } catch (e) {
            toast.error('Deletion failed');
        }
    };

    const handlePromoteAdmin = async (userId: string) => {
        if (!confirm('Are you sure you want to make this user an admin? This grants full access.')) return;
        try {
            const { promoteToAdmin } = await import('@/lib/firebase/firestore');
            await promoteToAdmin(userId);
            toast.success('User promoted to admin');
            const { getAllUsers } = await import('@/lib/firebase/firestore');
            const users = await getAllUsers();
            setAllUsers(users);
        } catch (e) {
            toast.error('Promotion failed');
        }
    };

    return (
        <ProtectedRoute requireAdmin>
            <div className="container-elegant py-8 animate-fade-in">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-beige-200/50 p-4 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                            <div className="flex items-center gap-3 mb-6 p-2">
                                <div className="w-10 h-10 bg-charcoal-100 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">A</span>
                                </div>
                                <div>
                                    <p className="font-medium">Admin</p>
                                    <p className="text-xs text-muted-foreground">admin@noormarket.com</p>
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
                                                ? 'bg-charcoal-100 text-white'
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

                                {/* Pending Vendors */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-lg">Pending Vendor Approvals</CardTitle>
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                            {pendingVendors.length} pending
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-beige-200">
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Submitted</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingVendors.map((vendor) => (
                                                        <tr key={vendor.id} className="border-b border-beige-100">
                                                            <td className="py-3 px-4 text-sm font-medium">{vendor.businessName}</td>
                                                            <td className="py-3 px-4 text-sm text-muted-foreground">{vendor.businessEmail}</td>
                                                            <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(vendor.createdAt)}</td>
                                                            <td className="py-3 px-4">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                                                        onClick={() => handleApproveVendor(vendor.id)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                                        onClick={() => handleRejectVendor(vendor.id)}
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-1" />
                                                                        Reject
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

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
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentOrders.map((order: any) => (
                                                        <tr key={order.id} className="border-b border-beige-100">
                                                            <td className="py-3 px-4 text-sm">{order.id.slice(0, 8)}</td>
                                                            <td className="py-3 px-4 text-sm">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                                                            <td className="py-3 px-4 text-sm text-muted-foreground">{order.items?.[0]?.vendorName || 'Multiple'}</td>
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

                        {/* Vendors Content */}
                        {activeTab === 'vendors' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">All Vendors</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-beige-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Join Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vendors.map((vendor) => (
                                                    <tr key={vendor.id} className="border-b border-beige-100">
                                                        <td className="py-3 px-4 text-sm font-medium">{vendor.businessName}</td>
                                                        <td className="py-3 px-4 text-sm text-muted-foreground">{vendor.businessEmail}</td>
                                                        <td className="py-3 px-4">
                                                            <Badge className={cn(
                                                                'capitalize',
                                                                vendor.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            )}>
                                                                {vendor.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(vendor.createdAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Users Content */}
                        {activeTab === 'users' && (
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">Registered Users</CardTitle>
                                        <Badge variant="outline">{allUsers.length} total</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-beige-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsers.map((user) => (
                                                    <tr key={user.id} className="border-b border-beige-100">
                                                        <td className="py-3 px-4 text-sm font-medium">{user.displayName || 'Unnamed User'}</td>
                                                        <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                                                        <td className="py-3 px-4">
                                                            <Badge className={cn(
                                                                'capitalize',
                                                                user.role === 'admin' ? 'bg-charcoal-100 text-white' :
                                                                    user.role === 'vendor' ? 'bg-gold-100 text-white' : 'bg-beige-100 text-charcoal-100'
                                                            )}>
                                                                {user.role}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {user.role !== 'admin' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="text-gold-100 hover:text-gold-200 hover:bg-gold-100/10"
                                                                        onClick={() => handlePromoteAdmin(user.id)}
                                                                        title="Promote to Admin"
                                                                    >
                                                                        <ShieldCheck className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
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

                        {/* Products Content */}
                        {activeTab === 'products' && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Global Product Inventory</CardTitle>
                                    <Badge variant="outline">{allProducts.length} items</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-beige-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor ID</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allProducts.map((product) => (
                                                    <tr key={product.id} className="border-b border-beige-100">
                                                        <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                                                        <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{product.vendorId?.slice(0, 8)}</td>
                                                        <td className="py-3 px-4 text-sm">{formatCurrency(product.price)}</td>
                                                        <td className="py-3 px-4 text-sm">
                                                            <span className={cn(
                                                                product.inventory <= 5 ? "text-red-500 font-bold" : ""
                                                            )}>
                                                                {product.inventory}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="capitalize" variant={product.status === 'active' ? 'default' : 'secondary'}>
                                                                    {product.status}
                                                                </Badge>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => handleDeleteProduct(product.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {allProducts.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                                            No products found in the system.
                                                        </td>
                                                    </tr>
                                                )}
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
                                    <CardTitle className="text-lg">Global Order Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-beige-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="border-b border-beige-100">
                                                        <td className="py-3 px-4 text-sm font-mono">{order.id.slice(0, 8).toUpperCase()}</td>
                                                        <td className="py-3 px-4 text-sm">{formatDate(order.createdAt)}</td>
                                                        <td className="py-3 px-4 text-sm">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                                                        <td className="py-3 px-4 text-sm font-medium">{formatCurrency(order.total)}</td>
                                                        <td className="py-3 px-4">
                                                            <Badge className="capitalize">{order.status}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews Content */}
                        {activeTab === 'reviews' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Product Reviews</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ReviewsAdminTab />
                                </CardContent>
                            </Card>
                        )}

                        {/* Analytics Content */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Revenue Analytics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-80 pt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={orders.reduce((acc: any[], order: any) => {
                                                    const month = formatDate(order.createdAt, { month: 'short' });
                                                    const existing = acc.find(i => i.month === month);
                                                    if (existing) {
                                                        existing.revenue += order.total;
                                                    } else {
                                                        acc.push({ month, revenue: order.total });
                                                    }
                                                    return acc;
                                                }, []).reverse()}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#C9A962" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#C9A962" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D5BC" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5D5BC' }}
                                                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                                />
                                                <Area type="monotone" dataKey="revenue" stroke="#C9A962" fillOpacity={1} fill="url(#colorRev)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-medium">Order Status Distribution</CardTitle>
                                        </CardHeader>
                                        <CardContent className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={[
                                                    { status: 'Placed', count: orders.filter(o => o.status === 'placed').length },
                                                    { status: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
                                                    { status: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
                                                ]}>
                                                    <XAxis dataKey="status" />
                                                    <Tooltip />
                                                    <Bar dataKey="count" fill="#2D2D2D" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                    <Card className="flex flex-col justify-center p-8 text-center bg-gold-100/5 border-gold-100/20">
                                        <p className="text-sm text-muted-foreground mb-2">Average Order Value</p>
                                        <p className="text-4xl font-heading font-semibold text-gold-100">
                                            {formatCurrency(orders.length > 0 ? orders.reduce((acc, o) => acc + o.total, 0) / orders.length : 0)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-4 italic">Updated in real-time</p>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Settings Content */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">System Management</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h3 className="font-medium mb-2">Initial Setup</h3>
                                            <p className="text-sm text-muted-foreground mb-4">Populate the database with initial categories, vendors, and products.</p>
                                            <Button
                                                variant="outline"
                                                onClick={async () => {
                                                    try {
                                                        const { seedDatabase } = await import('@/lib/firebase/firestore');
                                                        await seedDatabase();
                                                        toast.success('Database seeded successfully!');
                                                    } catch (e) {
                                                        toast.error('Seeding failed');
                                                    }
                                                }}
                                            >
                                                Seed Database
                                            </Button>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-2">Demo Accounts</h3>
                                            <p className="text-sm text-muted-foreground mb-4">Create Admin (admin@demo.com), Vendor (vendor@demo.com), and Customer (customer@demo.com) demo accounts with 'password123'.</p>
                                            <Button
                                                variant="outline"
                                                onClick={async () => {
                                                    try {
                                                        const { seedDemoAccounts } = await import('@/lib/dev-seed');
                                                        const count = await seedDemoAccounts();
                                                        toast.success(`${count} demo accounts created!`);
                                                    } catch (e) {
                                                        toast.error('Seeding accounts failed');
                                                    }
                                                }}
                                            >
                                                Seed Demo Accounts
                                            </Button>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium text-red-600 mb-2">Maintenance</h3>
                                            <Button variant="destructive" size="sm">Clear Cache & System Logs</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function ReviewsAdminTab() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            const { executeQuery } = await import('@/lib/firebase/firestore');
            const data = await executeQuery<any>('reviews', []);
            setReviews(data);
            setLoading(false);
        };
        loadReviews();
    }, []);

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading reviews...</div>;

    return (
        <div className="space-y-4">
            {reviews.map(review => (
                <div key={review.id} className="p-4 border border-beige-100 rounded-lg flex gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-medium">{review.title}</h4>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-gold-100 text-gold-100" : "text-beige-200")} />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{review.content}</p>
                        <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                            <span>By: {review.userName}</span>
                            <span>Product: {review.productId}</span>
                        </div>
                    </div>
                </div>
            ))}
            {reviews.length === 0 && <p className="text-center py-8 text-muted-foreground">No reviews to display.</p>}
        </div>
    );
}
