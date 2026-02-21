'use client';

import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-[calc(100vh-300px)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                            <span className="text-white font-heading font-bold text-xl">N</span>
                        </div>
                    </Link>
                </div>

                <RegisterForm />
            </div>
        </div>
    );
}
