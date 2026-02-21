'use client';

const STORY_MILESTONES = [
    { year: '2023', title: 'The Vision', desc: 'NoorMarket was conceived as a digital hub for the global Ummah.' },
    { year: '2024', title: 'Launch', desc: 'We launched our first curated collection of prayer mats and artisanal decor.' },
    { year: '2025', title: 'Expansion', desc: 'Reached 100+ verified vendors across 15 countries.' },
    { year: '2026', title: 'Global Impact', desc: 'Launched the collaborative vendor platform to empower small businesses.' }
];

export default function OurStoryPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-charcoal-100 py-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1590393080001-c60657eea523?w=1200&q=80" className="w-full h-full object-cover" />
                </div>
                <div className="container-elegant relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold mb-6">Our Journey</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        From a small idea to a global community of artisans and believers.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant max-w-4xl">
                    <div className="relative border-l-2 border-gold-100/30 pl-8 space-y-16">
                        {STORY_MILESTONES.map((milestone, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[41px] top-0 w-5 h-5 bg-gold-100 rounded-full border-4 border-white shadow-sm" />
                                <span className="text-gold-100 font-bold text-xl mb-2 block">{milestone.year}</span>
                                <h2 className="text-2xl font-bold mb-3">{milestone.title}</h2>
                                <p className="text-muted-foreground leading-relaxed">{milestone.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
