'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/utils';
import { SHIPPING } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getStripe } from '@/lib/stripe/config';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = getStripe();

export default function CheckoutPage() {
    const { items, subtotal, tax, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [shippingMethod, setShippingMethod] = useState<string>(SHIPPING.METHODS[0].id);

    return (
        <ProtectedRoute>
            {items.length === 0 ? (
                <div className="container-elegant py-16 text-center">
                    <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-charcoal-100/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-heading font-semibold mb-2">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-6">Add some items to your cart to proceed with checkout.</p>
                    <Button asChild>
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
            ) : (
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        items={items}
                        subtotal={subtotal}
                        tax={tax}
                        clearCart={clearCart}
                        user={user}
                        step={step}
                        setStep={setStep}
                        shippingMethod={shippingMethod}
                        setShippingMethod={setShippingMethod}
                    />
                </Elements>
            )}
        </ProtectedRoute>
    );
}

function CheckoutForm({
    items, subtotal, tax, clearCart, user,
    step, setStep, shippingMethod, setShippingMethod
}: any) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const selectedShipping = SHIPPING.METHODS.find((m: any) => m.id === shippingMethod);
    const finalShippingCost = subtotal >= SHIPPING.FREE_THRESHOLD ? 0 : (selectedShipping?.price || 0);
    const finalTotal = subtotal + finalShippingCost + tax;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            const { updateProductInventory, createOrder, getDocument } = await import('@/lib/firebase/firestore');

            // 1. Pre-Payment Stock Check (Prevention)
            for (const item of items) {
                const product = await getDocument<any>('products', item.productId);
                if (!product || product.inventory < item.quantity) {
                    toast.error(`Sorry, ${item.name} is now out of stock.`);
                    setIsProcessing(false);
                    return;
                }
            }

            const cardElement = elements.getElement(CardElement);

            // 2. Create Payment Intent on Server
            const response = await fetch('/api/checkout/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map((i: any) => ({ id: i.id, quantity: i.quantity })),
                    amount: finalTotal
                }),
            });

            const data = await response.json();
            if (data.error) {
                toast.error(data.error);
                setIsProcessing(false);
                return;
            }

            // 3. Confirm Payment with Stripe
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: {
                        name: `${(document.getElementById('firstName') as HTMLInputElement)?.value || ''} ${(document.getElementById('lastName') as HTMLInputElement)?.value || ''}`,
                        email: (document.getElementById('email') as HTMLInputElement)?.value || '',
                    }
                }
            });

            if (confirmError) {
                toast.error(confirmError.message);
                setIsProcessing(false);
                return;
            }

            // 4. Create Order in Firestore (Only after successful payment)
            const orderData = {
                userId: user.id,
                items: items.map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    vendorId: (item as any).vendorId || 'noormarket',
                })),
                total: finalTotal,
                subtotal,
                tax,
                shippingCost: finalShippingCost,
                status: 'placed' as const,
                shippingAddress: {
                    firstName: (document.getElementById('firstName') as HTMLInputElement)?.value || '',
                    lastName: (document.getElementById('lastName') as HTMLInputElement)?.value || '',
                    email: (document.getElementById('email') as HTMLInputElement)?.value || '',
                    phone: (document.getElementById('phone') as HTMLInputElement)?.value || '',
                    address: (document.getElementById('address') as HTMLInputElement)?.value || '',
                    city: (document.getElementById('city') as HTMLInputElement)?.value || '',
                    postalCode: (document.getElementById('postalCode') as HTMLInputElement)?.value || '',
                    country: (document.getElementById('country') as HTMLInputElement)?.value || '',
                },
                shippingMethod,
                paymentMethod: 'stripe',
                paymentStatus: 'paid',
                paymentIntentId: paymentIntent.id,
                timeline: [{
                    status: 'placed',
                    timestamp: new Date(),
                    note: 'Order placed successfully',
                    updatedBy: 'system'
                }],
            };

            await createOrder(orderData as any);

            // 3. Update Inventory
            for (const item of items) {
                await updateProductInventory(item.productId, -item.quantity);
            }

            // 4. Cleanup
            clearCart();
            toast.success('Order placed successfully!');
            router.push('/order-success');
        } catch (err) {
            console.error('Order error:', err);
            toast.error('Failed to process order');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container-elegant py-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/shop">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl md:text-3xl font-heading font-semibold">Checkout</h1>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4 mb-8">
                <div className={cn(
                    'flex items-center gap-2',
                    step === 'shipping' ? 'text-gold-100' : 'text-muted-foreground'
                )}>
                    <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        step === 'shipping' ? 'bg-gold-100 text-white' : 'bg-beige-100'
                    )}>
                        {step === 'payment' ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="hidden sm:inline">Shipping</span>
                </div>
                <div className="flex-1 h-px bg-beige-200" />
                <div className={cn(
                    'flex items-center gap-2',
                    step === 'payment' ? 'text-gold-100' : 'text-muted-foreground'
                )}>
                    <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        step === 'payment' ? 'bg-gold-100 text-white' : 'bg-beige-100'
                    )}>
                        2
                    </div>
                    <span className="hidden sm:inline">Payment</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {step === 'shipping' ? (
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6">
                            <h2 className="text-xl font-medium mb-6">Shipping Information</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="John" defaultValue={user?.displayName?.split(' ')[0]} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" defaultValue={user?.displayName?.split(' ')[1]} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" defaultValue={user?.email} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="123 Main Street" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="New York" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input id="postalCode" placeholder="10001" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input id="country" placeholder="United States" />
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <h3 className="font-medium mb-4">Shipping Method</h3>
                            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                                {SHIPPING.METHODS.map((method: any) => (
                                    <label
                                        key={method.id}
                                        className={cn(
                                            'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                                            shippingMethod === method.id
                                                ? 'border-gold-100 bg-gold-100/5'
                                                : 'border-beige-200 hover:border-beige-300'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value={method.id} id={method.id} />
                                            <div>
                                                <p className="font-medium">{method.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {subtotal >= SHIPPING.FREE_THRESHOLD && method.id === 'standard'
                                                        ? 'Free'
                                                        : formatCurrency(method.price)} • {method.days} business days
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </RadioGroup>

                            <Button
                                className="w-full mt-6"
                                size="lg"
                                onClick={() => setStep('payment')}
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-beige-200/50 p-6">
                            <h2 className="text-xl font-medium mb-6">Payment Method</h2>

                            <RadioGroup defaultValue="card" className="space-y-4 mb-8">
                                <div className={cn(
                                    "p-4 border rounded-xl transition-all",
                                    "border-gold-100 bg-gold-100/5 shadow-sm"
                                )}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="font-medium cursor-pointer flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            Credit / Debit Card
                                        </Label>
                                    </div>
                                    <div className="p-4 border rounded-lg bg-white">
                                        <CardElement
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#2D2D2D',
                                                        fontFamily: 'Outfit, sans-serif',
                                                        '::placeholder': {
                                                            color: '#A0A0A0',
                                                        },
                                                    },
                                                    invalid: {
                                                        color: '#EF4444',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 border border-beige-200 rounded-xl hover:border-beige-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="paypal" id="paypal" disabled />
                                            <Label htmlFor="paypal" className="font-medium text-muted-foreground flex items-center gap-2">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.727a.641.641 0 0 1 .632-.534H14.5c4.764 0 7.274 2.307 7.274 5.922 0 3.12-1.764 5.548-5.131 5.548h-1.352a.641.641 0 0 0-.632.534l-.801 5.074a.641.641 0 0 1-.632.534H9.172l.44-2.79a.641.641 0 0 0-.632-.74H7.076a.641.641 0 0 0-.632.534l-.534 3.383a.641.641 0 0 1-.632.534h1.798z" />
                                                </svg>
                                                PayPal
                                            </Label>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Coming Soon</Badge>
                                    </div>
                                </div>
                            </RadioGroup>

                            <div className="flex gap-3 mt-6">
                                <Button variant="outline" onClick={() => setStep('shipping')}>
                                    Back
                                </Button>
                                <Button
                                    className="flex-1"
                                    size="lg"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay ${formatCurrency(finalTotal)}`
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-beige-200/50 p-6 sticky top-36">
                        <h2 className="text-xl font-medium mb-4">Order Summary</h2>

                        {/* Items */}
                        <div className="space-y-3 mb-4 max-h-60 overflow-auto">
                            {items.map((item: any) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-16 h-16 bg-beige-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-charcoal-100/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-4" />

                        {/* Totals */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>
                                    {finalShippingCost === 0 ? (
                                        <span className="text-green-600">Free</span>
                                    ) : (
                                        formatCurrency(finalShippingCost)
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between text-base font-medium">
                                <span>Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>

                        {subtotal < SHIPPING.FREE_THRESHOLD && (
                            <div className="mt-4 p-3 bg-gold-100/10 rounded-lg text-sm">
                                <p className="text-gold-200">
                                    Add {formatCurrency(SHIPPING.FREE_THRESHOLD - subtotal)} more for free shipping!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
