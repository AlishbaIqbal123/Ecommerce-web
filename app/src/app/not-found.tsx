'use client';

import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative mb-8">
                <Search className="w-24 h-24 text-beige-200" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gold-200">
                    404
                </span>
            </div>

            <h1 className="text-3xl font-heading font-bold mb-3">Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                The page you are looking for doesn't exist or has been moved to another URL.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => router.back()} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </Button>
                <Button asChild className="gap-2">
                    <Link href="/">
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
