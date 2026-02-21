'use client';

import { Truck, MapPin, Clock } from 'lucide-react';

export default function ShippingPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-16 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl font-heading font-semibold mb-4">Shipping Information</h1>
                    <p className="text-muted-foreground">Fast and reliable delivery for your spiritual treasures.</p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant max-w-4xl">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center p-6 bg-cream-100 rounded-2xl">
                            <Truck className="w-10 h-10 text-gold-100 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Standard Shipping</h3>
                            <p className="text-sm text-muted-foreground">$5.99 | 5-10 business days</p>
                        </div>
                        <div className="text-center p-6 bg-cream-100 rounded-2xl">
                            <Clock className="w-10 h-10 text-gold-100 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Express Delivery</h3>
                            <p className="text-sm text-muted-foreground">$14.99 | 2-5 business days</p>
                        </div>
                        <div className="text-center p-6 bg-cream-100 rounded-2xl">
                            <MapPin className="w-10 h-10 text-gold-100 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">International</h3>
                            <p className="text-sm text-muted-foreground">Calculated at checkout</p>
                        </div>
                    </div>

                    <div className="prose prose-neutral max-w-none text-muted-foreground space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Free Shipping Policy</h2>
                            <p>
                                We offer free standard shipping on all orders over <strong>$75</strong>.
                                This threshold applies to the subtotal of your order after any discounts and
                                before taxes or shipping fees.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Processing Time</h2>
                            <p>
                                Orders are typically processed within 1-2 business days. During peak seasons
                                or sales, processing may take up to 3-5 business days. You will receive
                                a confirmation email once your order has been shipped.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Tracking Your Order</h2>
                            <p>
                                Once your order is shipped, you will receive an email containing a tracking
                                number and a link to track your package. Please allow 24-48 hours for the
                                tracking information to update.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
