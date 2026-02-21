'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Toaster } from '@/components/ui/sonner';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function Providers({ children }: { children: React.ReactNode }) {
    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        const unsubscribe = initializeAuth();
        return () => unsubscribe();
    }, [initializeAuth]);

    return (
        <>
            {children}
            <CartDrawer />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#FAF7F2',
                        border: '1px solid #E8DCC8',
                        color: '#2D2D2D',
                    },
                }}
            />
        </>
    );
}
