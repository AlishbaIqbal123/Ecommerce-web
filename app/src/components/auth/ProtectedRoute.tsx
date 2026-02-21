'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireVendor?: boolean;
}

export function ProtectedRoute({
    children,
    requireAdmin = false,
    requireVendor = false,
}: ProtectedRouteProps) {
    const { user, isAuthenticated, authInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (authInitialized) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (requireAdmin && user?.role !== 'admin') {
                router.push('/');
            } else if (requireVendor && user?.role !== 'vendor' && user?.role !== 'admin') {
                router.push('/');
            }
        }
    }, [authInitialized, isAuthenticated, user, requireAdmin, requireVendor, router]);

    if (!authInitialized) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-gold-100 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) return null;
    if (requireAdmin && user?.role !== 'admin') return null;
    if (requireVendor && user?.role !== 'vendor' && user?.role !== 'admin') return null;

    return <>{children}</>;
}
