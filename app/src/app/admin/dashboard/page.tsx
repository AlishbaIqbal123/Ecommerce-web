'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    LayoutDashboard, Users, Store, Package, ShoppingCart,
    BarChart3, Settings, CheckCircle, XCircle, DollarSign,
    Star, Trash2, ShieldCheck, Plus, Edit2, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { useVendorStore, useOrderStore } from '@/store';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, YAxis } from 'recharts';

const CATEGORIES = [
    { id: 'prayer-essentials', name: 'Prayer Essentials' },
    { id: 'modest-fashion', name: 'Modest Fashion' },
    { id: 'home-decor', name: 'Home Decor' },
    { id: 'books', name: 'Books' },
    { id: 'kids', name: 'Kids' },
    { id: 'gifts', name: 'Gifts' },
];

const ORDER_STATUSES = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];

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

    const reloadUsers = useCallback(async () => { const { getAllUsers } = await import('@/lib/firebase/firestore'); setAllUsers(await getAllUsers()); }, []);
    const reloadProducts = useCallback(async () => { const { getAllProductsAdmin } = await import('@/lib/firebase/firestore'); setAllProducts(await getAllProductsAdmin()); }, []);

    useEffect(() => {
        fetchVendorsAdmin();
        fetchAllOrders();
        reloadUsers();
        reloadProducts();
    }, [fetchVendorsAdmin, fetchAllOrders, reloadUsers, reloadProducts]);

    const pendingVendors = vendors.filter(v => v.status === 'pending');

    // ── vendor actions ────────────────────────────────────────────────────────
    const approveVendor = async (id: string) => {
        try { const { approveVendor: fn } = await import('@/lib/firebase/firestore'); await fn(id); toast.success('Vendor approved'); fetchVendorsAdmin(); }
        catch { toast.error('Failed'); }
    };
    const rejectVendor = async (id: string) => {
        try { const { rejectVendor: fn } = await import('@/lib/firebase/firestore'); await fn(id); toast.success('Vendor suspended'); fetchVendorsAdmin(); }
        catch { toast.error('Failed'); }
    };
    const deleteVendor = async (id: string) => {
        if (!confirm('Delete this vendor? This cannot be undone.')) return;
        try { const { deleteDocument } = await import('@/lib/firebase/firestore'); await deleteDocument('vendors', id); toast.success('Vendor deleted'); fetchVendorsAdmin(); }
        catch { toast.error('Failed'); }
    };

    // ── user actions ──────────────────────────────────────────────────────────
    const deleteUser = async (id: string) => {
        if (!confirm('Delete this user?')) return;
        try { const { deleteUserAdmin } = await import('@/lib/firebase/firestore'); await deleteUserAdmin(id); toast.success('User deleted'); reloadUsers(); }
        catch { toast.error('Failed'); }
    };
    const promoteAdmin = async (id: string) => {
        if (!confirm('Grant admin access?')) return;
        try { const { promoteToAdmin } = await import('@/lib/firebase/firestore'); await promoteToAdmin(id); toast.success('Promoted to admin'); reloadUsers(); }
        catch { toast.error('Failed'); }
    };
    const changeRole = async (id: string, role: string) => {
        try { const { updateDocument } = await import('@/lib/firebase/firestore'); await updateDocument('users', id, { role }); toast.success('Role updated'); reloadUsers(); }
        catch { toast.error('Failed'); }
    };

    // ── product actions ───────────────────────────────────────────────────────

    // ── order actions ─────────────────────────────────────────────────────────
    const updateOrderStatus = async (id: string, status: string) => {
        try { const { updateOrderStatus: fn } = await import('@/lib/firebase/firestore'); await fn(id, status as any); toast.success('Order updated'); fetchAllOrders(); }
        catch { toast.error('Failed'); }
    };
    const deleteOrder = async (id: string) => {
        if (!confirm('Delete this order?')) return;
        try { const { deleteDocument } = await import('@/lib/firebase/firestore'); await deleteDocument('orders', id); toast.success('Order deleted'); fetchAllOrders(); }
        catch { toast.error('Failed'); }
    };

    const stats = [
        { title: 'Total Revenue', value: formatCurrency(orders.reduce((a: number, o: any) => a + o.total, 0)), icon: DollarSign },
        { title: 'Total Orders', value: orders.length.toString(), icon: ShoppingCart },
        { title: 'Vendors', value: vendors.length.toString(), icon: Store },
        { title: 'Users', value: allUsers.length.toString(), icon: Users },
    ];

    return (
        <ProtectedRoute requireAdmin>
            <div className="container-elegant py-8 animate-fade-in">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-56 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-beige-200/50 p-4 sticky top-28">
                            <div className="flex items-center gap-3 mb-6 p-2">
                                <div className="w-9 h-9 bg-charcoal-100 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">A</span>
                                </div>
                                <div><p className="font-medium text-sm">Admin Panel</p></div>
                            </div>
                            <nav className="space-y-1">
                                {sidebarItems.map(item => (
                                    <button key={item.id} onClick={() => setActiveTab(item.id)}
                                        className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                            activeTab === item.id ? 'bg-charcoal-100 text-white' : 'hover:bg-beige-100 text-muted-foreground'
                                        )}>
                                        <item.icon className="w-4 h-4" />{item.label}
                                        {item.id === 'vendors' && pendingVendors.length > 0 && (
                                            <span className="ml-auto bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 rounded-full">{pendingVendors.length}</span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-heading font-semibold">{sidebarItems.find(i => i.id === activeTab)?.label}</h1>
                            <Button variant="ghost" size="sm" onClick={() => { fetchVendorsAdmin(); fetchAllOrders(); reloadUsers(); reloadProducts(); }}>
                                <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                            </Button>
                        </div>

                        {/* ── DASHBOARD ── */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.map(s => (
                                        <Card key={s.title}><CardContent className="p-6 flex items-center justify-between">
                                            <div><p className="text-sm text-muted-foreground">{s.title}</p><p className="text-2xl font-semibold mt-1">{s.value}</p></div>
                                            <div className="w-11 h-11 bg-gold-100/10 rounded-full flex items-center justify-center"><s.icon className="w-5 h-5 text-gold-100" /></div>
                                        </CardContent></Card>
                                    ))}
                                </div>
                                {/* Pending vendors quick-action */}
                                {pendingVendors.length > 0 && (
                                    <Card><CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-base">Pending Approvals</CardTitle>
                                        <Badge className="bg-yellow-100 text-yellow-800">{pendingVendors.length}</Badge>
                                    </CardHeader><CardContent>
                                            <div className="space-y-3">
                                                {pendingVendors.map(v => (
                                                    <div key={v.id} className="flex items-center justify-between p-3 bg-beige-50 rounded-lg">
                                                        <div><p className="font-medium text-sm">{v.businessName}</p><p className="text-xs text-muted-foreground">{v.businessEmail}</p></div>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approveVendor(v.id)}><CheckCircle className="w-3 h-3 mr-1" />Approve</Button>
                                                            <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => rejectVendor(v.id)}><XCircle className="w-3 h-3 mr-1" />Reject</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent></Card>
                                )}
                                <Card><CardHeader><CardTitle className="text-base">Recent Orders</CardTitle></CardHeader><CardContent>
                                    <table className="w-full text-sm"><thead><tr className="border-b border-beige-200">
                                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Order</th>
                                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Customer</th>
                                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Total</th>
                                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                                    </tr></thead><tbody>
                                            {orders.slice(0, 5).map((o: any) => (
                                                <tr key={o.id} className="border-b border-beige-100">
                                                    <td className="py-2 px-3 font-mono">{o.id.slice(0, 8).toUpperCase()}</td>
                                                    <td className="py-2 px-3">{o.shippingAddress?.firstName} {o.shippingAddress?.lastName}</td>
                                                    <td className="py-2 px-3">{formatCurrency(o.total)}</td>
                                                    <td className="py-2 px-3"><Badge className="capitalize text-xs">{o.status}</Badge></td>
                                                </tr>
                                            ))}
                                        </tbody></table>
                                </CardContent></Card>
                            </div>
                        )}

                        {/* ── VENDORS ── */}
                        {activeTab === 'vendors' && (
                            <div className="space-y-4">
                                <AdminVendorCRUD vendors={vendors} onApprove={approveVendor} onReject={rejectVendor} onDelete={deleteVendor} onRefresh={fetchVendorsAdmin} />
                            </div>
                        )}

                        {/* ── USERS ── */}
                        {activeTab === 'users' && (
                            <Card><CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">All Users</CardTitle>
                                <Badge variant="outline">{allUsers.length} total</Badge>
                            </CardHeader><CardContent>
                                    <div className="overflow-x-auto"><table className="w-full text-sm">
                                        <thead><tr className="border-b border-beige-200">
                                            {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>)}
                                        </tr></thead>
                                        <tbody>
                                            {allUsers.map(u => (
                                                <tr key={u.id} className="border-b border-beige-100 hover:bg-beige-50">
                                                    <td className="py-2 px-3 font-medium">{u.displayName || '—'}</td>
                                                    <td className="py-2 px-3 text-muted-foreground">{u.email}</td>
                                                    <td className="py-2 px-3">
                                                        <Select value={u.role} onValueChange={r => changeRole(u.id, r)}>
                                                            <SelectTrigger className="h-7 w-24 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="user">User</SelectItem>
                                                                <SelectItem value="vendor">Vendor</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="py-2 px-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                                                    <td className="py-2 px-3">
                                                        <div className="flex gap-1">
                                                            {u.role !== 'admin' && (
                                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gold-100" title="Make Admin" onClick={() => promoteAdmin(u.id)}><ShieldCheck className="w-3.5 h-3.5" /></Button>
                                                            )}
                                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" title="Delete" onClick={() => deleteUser(u.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table></div>
                                </CardContent></Card>
                        )}

                        {/* ── PRODUCTS ── */}
                        {activeTab === 'products' && (
                            <div className="space-y-4">
                                <AdminProductCRUD products={allProducts} vendors={vendors} onRefresh={reloadProducts} />
                            </div>
                        )}

                        {/* ── ORDERS ── */}
                        {activeTab === 'orders' && (
                            <Card><CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">All Orders</CardTitle>
                                <Badge variant="outline">{orders.length} total</Badge>
                            </CardHeader><CardContent>
                                    <div className="overflow-x-auto"><table className="w-full text-sm">
                                        <thead><tr className="border-b border-beige-200">
                                            {['Order ID', 'Date', 'Customer', 'Total', 'Status', 'Actions'].map(h => <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>)}
                                        </tr></thead>
                                        <tbody>
                                            {orders.map((o: any) => (
                                                <tr key={o.id} className="border-b border-beige-100 hover:bg-beige-50">
                                                    <td className="py-2 px-3 font-mono">{o.id.slice(0, 8).toUpperCase()}</td>
                                                    <td className="py-2 px-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                                                    <td className="py-2 px-3">{o.shippingAddress?.firstName} {o.shippingAddress?.lastName}</td>
                                                    <td className="py-2 px-3 font-medium">{formatCurrency(o.total)}</td>
                                                    <td className="py-2 px-3">
                                                        <Select value={o.status} onValueChange={s => updateOrderStatus(o.id, s)}>
                                                            <SelectTrigger className="h-7 w-36 text-xs capitalize"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                {ORDER_STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteOrder(o.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table></div>
                                </CardContent></Card>
                        )}

                        {/* ── REVIEWS ── */}
                        {activeTab === 'reviews' && <AdminReviewsTab />}

                        {/* ── ANALYTICS ── */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-6">
                                <Card><CardHeader><CardTitle className="text-base">Revenue Over Time</CardTitle></CardHeader>
                                    <CardContent className="h-72 pt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={orders.reduce((acc: any[], o: any) => {
                                                const m = new Date(o.createdAt?.seconds ? o.createdAt.seconds * 1000 : o.createdAt).toLocaleDateString('en', { month: 'short' });
                                                const ex = acc.find(i => i.month === m);
                                                ex ? ex.revenue += o.total : acc.push({ month: m, revenue: o.total });
                                                return acc;
                                            }, [])}>
                                                <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A962" stopOpacity={0.8} /><stop offset="95%" stopColor="#C9A962" stopOpacity={0} /></linearGradient></defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D5BC" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
                                                <Area type="monotone" dataKey="revenue" stroke="#C9A962" fill="url(#rev)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {[['placed', 'Placed'], ['shipped', 'Shipped'], ['delivered', 'Delivered']].map(([s, l]) => (
                                        <Card key={s}><CardContent className="p-6 text-center">
                                            <p className="text-muted-foreground text-sm mb-1">{l}</p>
                                            <p className="text-3xl font-semibold">{orders.filter((o: any) => o.status === s).length}</p>
                                        </CardContent></Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── SETTINGS ── */}
                        {activeTab === 'settings' && (
                            <Card><CardHeader><CardTitle className="text-base">System Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-1">Seed Database</h3>
                                        <p className="text-sm text-muted-foreground mb-3">Populate with demo categories, vendors and products.</p>
                                        <Button variant="outline" onClick={async () => {
                                            try { const { seedDatabase } = await import('@/lib/firebase/firestore'); await seedDatabase(); toast.success('Database seeded!'); }
                                            catch { toast.error('Seeding failed'); }
                                        }}>Seed Database</Button>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h3 className="font-medium mb-1">Demo Accounts</h3>
                                        <p className="text-sm text-muted-foreground mb-3">Create admin@demo.com, vendor@demo.com, customer@demo.com (password: password123).</p>
                                        <Button variant="outline" onClick={async () => {
                                            try { const { seedDemoAccounts } = await import('@/lib/dev-seed'); const n = await seedDemoAccounts(); toast.success(`${n} accounts created`); }
                                            catch { toast.error('Failed'); }
                                        }}>Create Demo Accounts</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR CRUD
// ─────────────────────────────────────────────────────────────────────────────
function AdminVendorCRUD({ vendors, onApprove, onReject, onDelete, onRefresh }: any) {
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<any>({});

    const openEdit = (v: any) => { setEditing(v); setForm({ businessName: v.businessName, businessEmail: v.businessEmail, businessPhone: v.businessPhone, description: v.description, status: v.status }); };

    const saveEdit = async () => {
        try {
            const { updateDocument } = await import('@/lib/firebase/firestore');
            await updateDocument('vendors', editing.id, form);
            // if status changed to approved, also update user role
            if (form.status === 'approved' && editing.status !== 'approved') {
                await updateDocument('users', editing.userId, { role: 'vendor' });
            }
            toast.success('Vendor updated'); setEditing(null); onRefresh();
        } catch { toast.error('Failed'); }
    };

    return (
        <>
            <Card><CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">All Vendors</CardTitle>
                <Badge variant="outline">{vendors.length} total</Badge>
            </CardHeader><CardContent>
                    <div className="overflow-x-auto"><table className="w-full text-sm">
                        <thead><tr className="border-b border-beige-200">
                            {['Business', 'Email', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {vendors.map((v: any) => (
                                <tr key={v.id} className="border-b border-beige-100 hover:bg-beige-50">
                                    <td className="py-2 px-3 font-medium">{v.businessName}</td>
                                    <td className="py-2 px-3 text-muted-foreground">{v.businessEmail}</td>
                                    <td className="py-2 px-3">
                                        <Badge className={cn('capitalize text-xs', v.status === 'approved' ? 'bg-green-100 text-green-700' : v.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>{v.status}</Badge>
                                    </td>
                                    <td className="py-2 px-3 text-muted-foreground">{formatDate(v.createdAt)}</td>
                                    <td className="py-2 px-3">
                                        <div className="flex gap-1">
                                            {v.status === 'pending' && <>
                                                <Button size="sm" variant="ghost" className="h-7 px-2 text-green-600 text-xs" onClick={() => onApprove(v.id)}><CheckCircle className="w-3 h-3 mr-1" />Approve</Button>
                                                <Button size="sm" variant="ghost" className="h-7 px-2 text-orange-500 text-xs" onClick={() => onReject(v.id)}><XCircle className="w-3 h-3 mr-1" />Reject</Button>
                                            </>}
                                            {v.status === 'approved' && <Button size="sm" variant="ghost" className="h-7 px-2 text-orange-500 text-xs" onClick={() => onReject(v.id)}>Suspend</Button>}
                                            {v.status === 'suspended' && <Button size="sm" variant="ghost" className="h-7 px-2 text-green-600 text-xs" onClick={() => onApprove(v.id)}>Reinstate</Button>}
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-500" onClick={() => openEdit(v)}><Edit2 className="w-3.5 h-3.5" /></Button>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => onDelete(v.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                </CardContent></Card>

            {/* Edit Dialog */}
            <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
                <DialogContent><DialogHeader><DialogTitle>Edit Vendor — {editing?.businessName}</DialogTitle></DialogHeader>
                    <div className="space-y-3 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1"><Label className="text-xs">Business Name</Label><Input value={form.businessName || ''} onChange={e => setForm((p: any) => ({ ...p, businessName: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Email</Label><Input value={form.businessEmail || ''} onChange={e => setForm((p: any) => ({ ...p, businessEmail: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Phone</Label><Input value={form.businessPhone || ''} onChange={e => setForm((p: any) => ({ ...p, businessPhone: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Status</Label>
                                <Select value={form.status} onValueChange={v => setForm((p: any) => ({ ...p, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="suspended">Suspended</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={3} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={saveEdit}>Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CRUD
// ─────────────────────────────────────────────────────────────────────────────
function AdminProductCRUD({ products, vendors, onRefresh }: any) {
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<any>({});
    const [adding, setAdding] = useState(false);
    const [newForm, setNewForm] = useState({ name: '', description: '', price: '', inventory: '', categoryId: '', vendorId: '', images: [''] });
    const [saving, setSaving] = useState(false);

    const openEdit = (p: any) => {
        setEditing(p);
        setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            inventory: p.inventory,
            categoryId: p.categoryId,
            status: p.status,
            images: p.images?.length ? p.images : [''],
        });
    };

    const saveEdit = async () => {
        const finalImages = (form.images || []).filter(Boolean);
        if (finalImages.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }
        setSaving(true);
        try {
            const { updateDocument } = await import('@/lib/firebase/firestore');
            await updateDocument('products', editing.id, { ...form, price: Number(form.price), inventory: Number(form.inventory), images: finalImages });
            toast.success('Product updated'); setEditing(null); onRefresh();
        } catch { toast.error('Failed'); } finally { setSaving(false); }
    };

    const addProduct = async () => {
        if (!newForm.vendorId) { toast.error('Select a vendor'); return; }
        const finalImages = newForm.images.filter(Boolean);
        if (finalImages.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }
        setSaving(true);
        try {
            const { addProductAdmin } = await import('@/lib/firebase/firestore');
            const v = vendors.find((x: any) => x.id === newForm.vendorId);
            await addProductAdmin({ vendorId: newForm.vendorId, vendorName: v?.businessName || '', categoryId: newForm.categoryId, name: newForm.name, slug: newForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), description: newForm.description, price: Number(newForm.price), inventory: Number(newForm.inventory), images: finalImages, status: 'active', featured: false, rating: 0, reviewCount: 0, salesCount: 0, viewsCount: 0, tags: [], sku: `ADMIN-${Date.now()}`, trackInventory: true, allowBackorders: false });
            toast.success('Product added'); setAdding(false); setNewForm({ name: '', description: '', price: '', inventory: '', categoryId: '', vendorId: '', images: [''] }); onRefresh();
        } catch { toast.error('Failed'); } finally { setSaving(false); }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        try { const { deleteProductAdmin } = await import('@/lib/firebase/firestore'); await deleteProductAdmin(id); toast.success('Deleted'); onRefresh(); }
        catch { toast.error('Failed'); }
    };

    return (
        <>
            <Card><CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">All Products</CardTitle>
                <Button size="sm" onClick={() => setAdding(true)}><Plus className="w-4 h-4 mr-1" />Add Product</Button>
            </CardHeader><CardContent>
                    <div className="overflow-x-auto"><table className="w-full text-sm">
                        <thead><tr className="border-b border-beige-200">
                            {['Product', 'Vendor', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {products.map((p: any) => (
                                <tr key={p.id} className="border-b border-beige-100 hover:bg-beige-50">
                                    <td className="py-2 px-3 font-medium max-w-[160px] truncate">{p.name}</td>
                                    <td className="py-2 px-3 text-muted-foreground text-xs">{p.vendorName || p.vendorId?.slice(0, 8)}</td>
                                    <td className="py-2 px-3 text-muted-foreground text-xs">{p.categoryId}</td>
                                    <td className="py-2 px-3">{formatCurrency(p.price)}</td>
                                    <td className="py-2 px-3"><span className={p.inventory <= 5 ? 'text-red-500 font-bold' : ''}>{p.inventory}</span></td>
                                    <td className="py-2 px-3"><Badge className="capitalize text-xs" variant={p.status === 'active' ? 'default' : 'secondary'}>{p.status}</Badge></td>
                                    <td className="py-2 px-3"><div className="flex gap-1">
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-500" onClick={() => openEdit(p)}><Edit2 className="w-3.5 h-3.5" /></Button>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteProduct(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                    </div></td>
                                </tr>
                            ))}
                            {products.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No products yet.</td></tr>}
                        </tbody>
                    </table></div>
                </CardContent></Card>

            {/* Add Dialog */}
            <Dialog open={adding} onOpenChange={setAdding}>
                <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                    <div className="space-y-3 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1 col-span-2"><Label className="text-xs">Product Name</Label><Input value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Vendor</Label>
                                <Select value={newForm.vendorId} onValueChange={v => setNewForm(p => ({ ...p, vendorId: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                                    <SelectContent>{vendors.filter((v: any) => v.status === 'approved').map((v: any) => <SelectItem key={v.id} value={v.id}>{v.businessName}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1"><Label className="text-xs">Category</Label>
                                <Select value={newForm.categoryId} onValueChange={v => setNewForm(p => ({ ...p, categoryId: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1"><Label className="text-xs">Price ($)</Label><Input type="number" step="0.01" value={newForm.price} onChange={e => setNewForm(p => ({ ...p, price: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Inventory</Label><Input type="number" value={newForm.inventory} onChange={e => setNewForm(p => ({ ...p, inventory: e.target.value }))} /></div>
                            <div className="space-y-1 col-span-2">
                                <Label className="text-xs">Product Images</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {newForm.images.map((url, index) => (
                                        <div key={index} className="space-y-2">
                                            <ImageUpload
                                                value={url}
                                                onChange={(newUrl) => setNewForm(p => {
                                                    const updated = [...p.images];
                                                    updated[index] = newUrl;
                                                    return { ...p, images: updated };
                                                })}
                                                storagePath={() => `products/${newForm.vendorId || 'admin'}/admin_new_${index}_${Date.now()}.jpg`}
                                                shape="square"
                                                placeholder={index === 0 ? 'Cover image' : 'Add image'}
                                            />
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => setNewForm(p => ({ ...p, images: p.images.filter((_: string, i: number) => i !== index) }))}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {newForm.images.length < 6 && (
                                        <Button type="button" variant="outline" className="h-full min-h-[100px]" onClick={() => setNewForm(p => ({ ...p, images: [...p.images, ''] }))}>
                                            <Plus className="w-4 h-4 mr-1" /> Add Slot
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={newForm.description} onChange={e => setNewForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button><Button onClick={addProduct} disabled={saving}>{saving ? 'Adding...' : 'Add Product'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
                <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
                    <div className="space-y-3 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1 col-span-2"><Label className="text-xs">Name</Label><Input value={form.name || ''} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Price ($)</Label><Input type="number" step="0.01" value={form.price || ''} onChange={e => setForm((p: any) => ({ ...p, price: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Inventory</Label><Input type="number" value={form.inventory || ''} onChange={e => setForm((p: any) => ({ ...p, inventory: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Category</Label>
                                <Select value={form.categoryId} onValueChange={v => setForm((p: any) => ({ ...p, categoryId: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1"><Label className="text-xs">Status</Label>
                                <Select value={form.status} onValueChange={v => setForm((p: any) => ({ ...p, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <Label className="text-xs">Product Images</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(form.images || []).map((url: string, index: number) => (
                                        <div key={index} className="space-y-2">
                                            <ImageUpload
                                                value={url}
                                                onChange={(newUrl) => setForm((p: any) => {
                                                    const updated = [...(p.images || [])];
                                                    updated[index] = newUrl;
                                                    return { ...p, images: updated };
                                                })}
                                                storagePath={() => `products/${editing?.vendorId || 'admin'}/admin_edit_${editing?.id || 'new'}_${index}_${Date.now()}.jpg`}
                                                shape="square"
                                                placeholder={index === 0 ? 'Cover image' : 'Add image'}
                                            />
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => setForm((p: any) => ({ ...p, images: (p.images || []).filter((_: string, i: number) => i !== index) }))}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {(form.images || []).length < 6 && (
                                        <Button type="button" variant="outline" className="h-full min-h-[100px]" onClick={() => setForm((p: any) => ({ ...p, images: [...(p.images || []), ''] }))}>
                                            <Plus className="w-4 h-4 mr-1" /> Add Slot
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={3} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={saveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS TAB
// ─────────────────────────────────────────────────────────────────────────────
function AdminReviewsTab() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const { executeQuery } = await import('@/lib/firebase/firestore');
        const data = await executeQuery<any>('reviews', []);
        setReviews(data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const deleteReview = async (id: string) => {
        if (!confirm('Delete this review?')) return;
        try { const { deleteDocument } = await import('@/lib/firebase/firestore'); await deleteDocument('reviews', id); toast.success('Review deleted'); load(); }
        catch { toast.error('Failed'); }
    };

    if (loading) return <div className="py-12 text-center text-muted-foreground">Loading reviews...</div>;

    return (
        <Card><CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">All Reviews</CardTitle>
            <Badge variant="outline">{reviews.length} total</Badge>
        </CardHeader><CardContent>
                <div className="space-y-3">
                    {reviews.map(r => (
                        <div key={r.id} className="flex gap-4 p-4 border border-beige-100 rounded-lg hover:bg-beige-50">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className="font-medium text-sm truncate">{r.title || 'No title'}</p>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {[...Array(5)].map((_, i) => <Star key={i} className={cn('w-3 h-3', i < r.rating ? 'fill-gold-100 text-gold-100' : 'text-beige-200')} />)}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{r.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">By: {r.userName || r.userId?.slice(0, 8)} · Product: {r.productId?.slice(0, 8)}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 flex-shrink-0" onClick={() => deleteReview(r.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-center py-8 text-muted-foreground">No reviews yet.</p>}
                </div>
            </CardContent></Card>
    );
}
