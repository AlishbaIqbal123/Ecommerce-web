'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Store, User as UserIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { seedDemoAccounts } from '@/lib/dev-seed';
import { toast } from 'sonner';

export default function LoginPage() {
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const count = await seedDemoAccounts();
            if (count > 0) {
                toast.success(`Created ${count} demo accounts! You can now sign in.`);
            } else {
                toast.info('Demo accounts already exist.');
            }
        } catch (error) {
            toast.error('Failed to seed demo accounts');
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4 gap-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                            <span className="text-white font-heading font-bold text-xl">N</span>
                        </div>
                    </Link>
                </div>

                <LoginForm />

                {/* Demo Accounts Section */}
                <div className="mt-12 pt-8 border-t border-beige-200 w-full">
                    <div className="text-center mb-6">
                        <h3 className="font-heading font-medium text-lg uppercase tracking-wider text-muted-foreground">
                            Testing & Demo Access
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Quickly test the platform with preset roles
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Button
                            variant="outline"
                            className="bg-white border-gold-100/30 hover:bg-gold-100/5 h-auto py-4 justify-start"
                            onClick={handleSeed}
                            disabled={isSeeding}
                        >
                            {isSeeding ? (
                                <Loader2 className="w-5 h-5 mr-4 animate-spin text-gold-100" />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-gold-100/10 flex items-center justify-center mr-4">
                                    <ShieldCheck className="w-5 h-5 text-gold-100" />
                                </div>
                            )}
                            <div className="text-left">
                                <p className="font-medium text-charcoal-100">Setup Test Accounts</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">One-time Initialization</p>
                            </div>
                        </Button>

                        <div className="p-4 bg-beige-50 rounded-xl border border-beige-200">
                            <p className="text-xs font-semibold text-charcoal-100/60 uppercase tracking-wider mb-3">Available Credentials</p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Admin:
                                    </span>
                                    <code className="bg-white px-2 py-0.5 rounded border border-beige-200">admin@demo.com</code>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Store className="w-3.5 h-3.5" /> Vendor:
                                    </span>
                                    <code className="bg-white px-2 py-0.5 rounded border border-beige-200">vendor@demo.com</code>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <UserIcon className="w-3.5 h-3.5" /> User:
                                    </span>
                                    <code className="bg-white px-2 py-0.5 rounded border border-beige-200">customer@demo.com</code>
                                </div>
                                <p className="text-[10px] text-center text-muted-foreground pt-2 italic">Password: password123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
