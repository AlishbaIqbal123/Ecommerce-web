import { Suspense } from 'react';
import ShopPage from '@/app/shop/page';

interface CategoryPageProps {
    params: Promise<{ categoryId: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoryId } = await params;

    return (
        <Suspense fallback={<div>Loading category...</div>}>
            <ShopPage categoryId={categoryId} />
        </Suspense>
    );
}
