import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
    return (
        <div className="container-elegant py-20 flex flex-col items-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
                Thank You for Your Order!
            </h1>
            <p className="text-muted-foreground max-w-lg mb-8 text-lg">
                Your order has been placed successfully. We've sent a confirmation email with all the details and will notify you when your items are on the way.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="min-w-[200px]">
                    <Link href="/profile">
                        View My Orders
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                    <Link href="/shop">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    );
}
