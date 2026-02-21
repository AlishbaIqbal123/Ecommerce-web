'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>

            <h1 className="text-3xl font-heading font-bold mb-3">Something went wrong</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We apologize for the inconvenience. An unexpected error occurred in the application.
            </p>

            {process.env.NODE_ENV === 'development' && (
                <div className="mb-8 p-4 bg-beige-50 rounded-lg text-left overflow-x-auto max-w-2xl w-full border border-beige-200">
                    <p className="font-mono text-sm text-red-600 mb-2">{error.message}</p>
                    <pre className="text-xs text-muted-foreground">{error.stack}</pre>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => reset()} className="gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </Button>
                <Button variant="outline" asChild className="gap-2">
                    <Link href="/">
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
