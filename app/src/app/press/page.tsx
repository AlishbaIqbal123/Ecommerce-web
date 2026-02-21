'use client';

import { APP_NAME } from '@/lib/constants';
import { Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PressPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-16 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl font-heading font-semibold mb-4">Press Room</h1>
                    <p className="text-muted-foreground">Resources and news about {APP_NAME}'s journey.</p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant max-w-5xl">
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="col-span-2 space-y-8">
                            <h2 className="text-2xl font-bold">Latest News</h2>
                            {[
                                { date: 'May 15, 2025', title: `${APP_NAME} Reaches 1,000 Verified Artisans Landmark`, snippet: 'The platform continues its rapid growth, connecting talent with global customers.' },
                                { date: 'March 10, 2025', title: 'New "Collaborative Vendor" Model Launches', snippet: 'Revolutionizing how small teams manage shared store spaces online.' }
                            ].map((news, i) => (
                                <div key={i} className="group p-6 bg-white border border-beige-200/50 rounded-xl hover:shadow-lg transition-all cursor-pointer">
                                    <span className="text-sm text-gold-100 font-medium">{news.date}</span>
                                    <h3 className="text-xl font-bold mt-1 group-hover:text-gold-200">{news.title}</h3>
                                    <p className="text-muted-foreground text-sm mt-3">{news.snippet}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-charcoal-100 text-white rounded-xl">
                                <h3 className="text-lg font-bold mb-4">Media Assets</h3>
                                <p className="text-white/70 text-sm mb-6">Download our brand kit, logos, and high-res photography.</p>
                                <Button variant="secondary" className="w-full">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Kit
                                </Button>
                            </div>
                            <div className="p-6 border border-beige-200 rounded-xl">
                                <h3 className="text-lg font-bold mb-2">Media Contacts</h3>
                                <p className="text-sm text-muted-foreground mb-4">For press inquiries, please reach out to:</p>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Mail className="w-4 h-4 text-gold-100" />
                                    <span>press@example.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
