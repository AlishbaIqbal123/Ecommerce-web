'use client';

import { APP_NAME } from '@/lib/constants';

export default function TermsPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-16 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl font-heading font-semibold mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container-elegant max-w-4xl prose prose-neutral prose-gold">
                    <div className="space-y-8 text-muted-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using {APP_NAME}, you agree to be bound by these Terms of Service
                                and all applicable laws and regulations. If you do not agree with any of these
                                terms, you are prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
                            <p>
                                Permission is granted to temporarily download one copy of the materials (information or software)
                                on {APP_NAME}'s website for personal, non-commercial transitory viewing only.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Disclaimer</h2>
                            <p>
                                The materials on {APP_NAME}'s website are provided on an 'as is' basis. {APP_NAME}
                                makes no warranties, expressed or implied, and hereby disclaims and negates all other
                                warranties including, without limitation, implied warranties or conditions of
                                merchantability, fitness for a particular purpose, or non-infringement of
                                intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Vendor Relationships</h2>
                            <p>
                                {APP_NAME} acts as a marketplace that connects buyers with independent vendors.
                                Each vendor is responsible for their own products, shipping, and compliance with
                                local laws. {APP_NAME} is not responsible for the quality or delivery of products
                                sold by independent vendors, though we strive to ensure only high-quality vendors
                                participate in our marketplace.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Governing Law</h2>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the
                                laws of the jurisdiction in which {APP_NAME} operates and you irrevocably
                                submit to the exclusive jurisdiction of the courts in that State or location.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
}
