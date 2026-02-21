'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { APP_NAME } from '@/lib/constants';

const FAQS = [
    {
        category: "General",
        items: [
            {
                q: "What is NoorMarket?",
                a: "NoorMarket is a premium e-commerce platform dedicated to Islamic lifestyle products, connecting high-quality vendors with customers worldwide."
            },
            {
                q: "Do you ship internationally?",
                a: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
            }
        ]
    },
    {
        category: "Orders & Shipping",
        items: [
            {
                q: "How can I track my order?",
                a: "Once your order is shipped, you will receive a tracking number via email to monitor its progress."
            },
            {
                q: "What are your shipping rates?",
                a: "Standard shipping is $5.99, and free for orders over $75. Express shipping is also available."
            }
        ]
    }
];

export default function FAQPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-20 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Find answers to common questions about {APP_NAME}, orders, and our products.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant max-w-4xl">
                    {FAQS.map((category, idx) => (
                        <div key={idx} className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {category.items.map((item, i) => (
                                    <AccordionItem key={i} value={`item-${idx}-${i}`}>
                                        <AccordionTrigger className="text-left font-medium">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
