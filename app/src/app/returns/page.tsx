'use client';

import { RotateCcw, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-16 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl font-heading font-semibold mb-4">Returns & Refunds</h1>
                    <p className="text-muted-foreground">Easy returns because your satisfaction is our priority.</p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant max-w-4xl">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center p-6 bg-cream-100 rounded-2xl">
                            <RotateCcw className="w-10 h-10 text-gold-100 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">30-Day Returns</h3>
                            <p className="text-sm text-muted-foreground">Return items within 30 days of delivery.</p>
                        </div>
                        <div className="text-center p-6 bg-cream-100 rounded-2xl">
                            <ShieldCheck className="w-10 h-10 text-gold-100 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Secure Refund</h3>
                            <p className="text-sm text-muted-foreground">Refunds credited to original payment.</p>
                        </div>
                        <div className="text-center p-6 bg-cream-100 rounded-2xl">
                            <AlertCircle className="w-10 h-10 text-gold-100 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Dedicated Support</h3>
                            <p className="text-sm text-muted-foreground">We're here to help with any issues.</p>
                        </div>
                    </div>

                    <div className="prose prose-neutral max-w-none text-muted-foreground space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Return Eligibility</h2>
                            <p>
                                To be eligible for a return, your item must be in the same condition that you
                                received it, unworn or unused, with tags, and in its original packaging.
                                You'll also need the receipt or proof of purchase.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">How to Start a Return</h2>
                            <p>
                                To start a return, you can contact us at support@example.com. If your return
                                is accepted, we'll send you a return shipping label, as well as instructions
                                on how and where to send your package. Items sent back to us without first
                                requesting a return will not be accepted.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Damages and Issues</h2>
                            <p>
                                Please inspect your order upon reception and contact us immediately if the
                                item is defective, damaged or if you receive the wrong item, so that we can
                                evaluate the issue and make it right.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
