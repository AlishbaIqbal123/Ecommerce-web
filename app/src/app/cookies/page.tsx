'use client';

import { APP_NAME } from '@/lib/constants';

export default function CookiesPage() {
    return (
        <div className="animate-fade-in mb-20">
            <section className="bg-beige-100 py-16 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl font-heading font-semibold mb-4">Cookie Policy</h1>
                    <p className="text-muted-foreground">Learn how we use cookies to improve your experience.</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container-elegant max-w-4xl prose prose-neutral">
                    <div className="space-y-6 text-muted-foreground">
                        <h2 className="text-2xl font-semibold text-foreground">What are cookies?</h2>
                        <p>
                            Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                            They are widely used to make websites work more efficiently and provide information to the website owners.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground">How we use cookies</h2>
                        <p>
                            {APP_NAME} uses cookies for several purposes, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Essential cookies:</strong> These are necessary for the website to function correctly, such as keeping you logged in.</li>
                            <li><strong>Analytics cookies:</strong> We use these to understand how visitors interact with our website.</li>
                            <li><strong>Preference cookies:</strong> These allow us to remember your choices, like your preferred language or currency.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-foreground">Managing your cookies</h2>
                        <p>
                            Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies,
                            but please note that this may affect your ability to use certain features of our website.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
