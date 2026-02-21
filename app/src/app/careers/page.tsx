'use client';

import { APP_NAME } from '@/lib/constants';
import { Briefcase, Heart, Globe, Zap } from 'lucide-react';

export default function CareersPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-20 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">Join Our Mission</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Help us build the most trusted and beautiful Islamic marketplace in the world.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant">
                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Why Work at {APP_NAME}?</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We're a remote-first, mission-driven team dedicated to empowering the global Muslim community.
                                At NoorMarket, you'll have the opportunity to work on cutting-edge technology while making a
                                real impact on small businesses and artisans worldwide.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Globe className="w-5 h-5 text-gold-100" />
                                    <span className="text-sm font-medium">Remote-First</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Heart className="w-5 h-5 text-gold-100" />
                                    <span className="text-sm font-medium">Mission Driven</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-gold-100" />
                                    <span className="text-sm font-medium">Fast Growth</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Briefcase className="w-5 h-5 text-gold-100" />
                                    <span className="text-sm font-medium">Ownership</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-charcoal-100 rounded-2xl p-8 text-white flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-4 text-gold-100">Ready to contribute?</h3>
                            <p className="text-white/70 mb-6">We're always looking for passionate designers, engineers, and market specialists.</p>
                            <a href={`mailto:careers@example.com`} className="text-white hover:text-gold-100 underline font-medium">careers@example.com</a>
                        </div>
                    </div>

                    <div className="text-center py-12 border-2 border-dashed border-beige-200 rounded-2xl bg-cream-100/50">
                        <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Current Openings</h3>
                        <p className="text-muted-foreground">We don't have any specific openings right now, but feel free to reach out!</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { Package } from 'lucide-react';
