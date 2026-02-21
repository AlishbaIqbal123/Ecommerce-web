'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Order } from '@/types';

export default function OrderTrackingPage() {
    const params = useParams();
    const id = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        let unsubscribe = () => { };

        const loadOrder = async () => {
            const { subscribeToDocument } = await import('@/lib/firebase/firestore');

            unsubscribe = subscribeToDocument<Order>('orders', id, (updatedOrder) => {
                if (updatedOrder) {
                    setOrder(updatedOrder);
                }
                setIsLoading(false);
            });
        };

        loadOrder();

        return () => unsubscribe();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-gold-100 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container-elegant py-20 text-center">
                <h2 className="text-2xl font-heading font-semibold mb-4">Order not found</h2>
                <Button asChild>
                    <Link href="/profile">Back to My Orders</Link>
                </Button>
            </div>
        );
    }

    const steps = [
        { status: 'placed', label: 'Order Placed', icon: Clock },
        { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
        { status: 'processing', label: 'Processing', icon: Package },
        { status: 'shipped', label: 'Shipped', icon: Truck },
        { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    return (
        <ProtectedRoute>
            <div className="container-elegant py-8 animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/profile">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-heading font-semibold">Order Tracking</h1>
                        <p className="text-sm text-muted-foreground">Order #{order.id.toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Tracker */}
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6 sm:p-10">
                            <div className="relative flex justify-between">
                                {/* Connector Line */}
                                <div className="absolute top-5 left-0 w-full h-0.5 bg-beige-100 -z-10" />
                                <div
                                    className="absolute top-5 left-0 h-0.5 bg-gold-100 transition-all duration-500 -z-10"
                                    style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                                />

                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={step.status} className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-500",
                                                isCompleted ? "border-gold-100 text-gold-100" : "border-beige-200 text-muted-foreground",
                                                isCurrent && "ring-4 ring-gold-100/20"
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <p className={cn(
                                                "mt-3 text-xs font-medium text-center",
                                                isCompleted ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6">
                            <h2 className="text-lg font-medium mb-6">Activity Log</h2>
                            <div className="space-y-6">
                                {[...(order.timeline || [])].reverse().map((event, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="relative flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-gold-100 mt-2" />
                                            {index < order.timeline.length - 1 && (
                                                <div className="w-px h-full bg-beige-200 absolute top-4" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium capitalize">{event.status.replace('-', ' ')}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                                            {event.note && (
                                                <p className="text-sm mt-1 text-muted-foreground italic">"{event.note}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {order.timeline?.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No activity logged yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6">
                            <h2 className="text-lg font-medium mb-4">Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.productId} className="flex gap-4">
                                        <div className="w-16 h-16 bg-beige-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6">
                            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{formatCurrency(order.shipping)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatCurrency(order.tax)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-base font-semibold">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <u className="w-4 h-4 text-gold-100" />
                                <h2 className="text-lg font-medium">Shipping Details</h2>
                            </div>
                            <div className="text-sm space-y-1">
                                <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.address1}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                                <p className="text-muted-foreground mt-2">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-4 h-4 text-gold-100" />
                                <h2 className="text-lg font-medium">Payment Information</h2>
                            </div>
                            <div className="text-sm">
                                <p className="capitalize text-muted-foreground">Method: <span className="text-foreground font-medium">{order.paymentMethod.type}</span></p>
                                <p className="capitalize text-muted-foreground mt-2 flex items-center">Status: <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 ml-2">{order.paymentStatus}</Badge></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
