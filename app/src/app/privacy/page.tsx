'use client';

import { APP_NAME } from '@/lib/constants';

export default function PrivacyPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-16 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl font-heading font-semibold mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container-elegant max-w-4xl prose prose-neutral prose-gold">
                    <div className="space-y-8 text-muted-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                            <p>
                                Welcome to {APP_NAME}. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you about how we look after your personal data when you visit our
                                website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">2. The Data We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have
                                grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                <li><strong>Financial Data:</strong> includes payment card details (processed securely via Stripe).</li>
                                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, login data, browser type and version.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your
                                personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>To register you as a new customer.</li>
                                <li>To process and deliver your order.</li>
                                <li>To manage our relationship with you.</li>
                                <li>To improve our website, products/services, marketing and customer relationships.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being
                                accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                We limit access to your personal data to those employees, agents, contractors and other
                                third parties who have a business need to know.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
}
