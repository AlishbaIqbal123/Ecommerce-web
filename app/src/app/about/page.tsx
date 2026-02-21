'use client';

import { APP_NAME } from '@/lib/constants';
import { Target, Users, Heart, Shield } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-20 text-center rounded-b-[3rem]">
                <div className="container-elegant">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold mb-6">Our Mission & Values</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Connecting the global Ummah through premium, artisanal Islamic lifestyle products that inspire faith and beauty.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold">Bridging Tradition & Modernity</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {APP_NAME} was founded with a clear purpose: to curate a marketplace where the modern Muslim family can find products that resonate with their faith without compromising on quality or aesthetic.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Our platform empowers talented artisans, innovative makers, and small businesses from around the world, bringing their unique treasures to your home and heart.
                            </p>
                        </div>
                        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=2070"
                                alt="Modern Islamic Lifestyle"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                            />
                            <div className="absolute inset-0 bg-charcoal-100/10" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Target, title: 'Our Mission', desc: 'To empower artisans and provide the Ummah with meaningful, high-quality products.' },
                            { icon: Users, title: 'Global Community', desc: 'Fostering a sense of belonging through shared values and beautiful craftsmanship.' },
                            { icon: Heart, title: 'Artisan Quality', desc: 'Hand-picked products that combine centuries of tradition with modern design.' },
                            { icon: Shield, title: 'Unwavering Trust', desc: 'Strictly vetted vendors and secure shopping for your absolute peace of mind.' }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-8 bg-cream-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-beige-200">
                                <div className="w-16 h-16 bg-gold-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="w-8 h-8 text-gold-100" />
                                </div>
                                <h3 className="text-xl font-heading font-semibold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

