'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
    const [env, setEnv] = useState<Record<string, string>>({});

    useEffect(() => {
        setEnv({
            FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Present (Starts with ' + process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5) + '...)' : 'MISSING',
            FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
            FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING',
            STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Present' : 'MISSING',
        });
    }, []);

    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const { seedDatabase } = await import('@/lib/firebase/firestore');
            await seedDatabase();
            alert('Database seeded successfully!');
        } catch (err) {
            console.error(err);
            alert('Seeding failed. Check console.');
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="container-elegant py-20">
            <h1 className="text-3xl font-bold mb-8">Environment Debug</h1>
            <div className="bg-white p-6 rounded-xl border border-beige-200">
                <pre className="text-sm">
                    {JSON.stringify(env, null, 2)}
                </pre>
            </div>

            <div className="mt-8 p-6 bg-white rounded-xl border border-beige-200">
                <h2 className="text-xl font-bold mb-4">Quick Fixes</h2>
                <div className="flex gap-4">
                    <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="px-6 py-2 bg-gold-100 text-white rounded-lg hover:bg-gold-200 disabled:opacity-50 transition-colors"
                    >
                        {isSeeding ? 'Seeding...' : 'Seed Database with Mock Data'}
                    </button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground italic">
                    Use this to populate Firestore with the initial vendors, categories, and products if the site is empty.
                </p>
            </div>

            <div className="mt-8 p-4 bg-beige-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                    If any of these say <strong>MISSING</strong>, you must restart your <code>npm run dev</code> server to pick up changes in the <code>.env</code> file.
                </p>
            </div>
        </div>
    );
}
