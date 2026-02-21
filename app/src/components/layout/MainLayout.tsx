import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toaster } from '@/components/ui/sonner';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-[120px]">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Toast Notifications */}
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
    </div>
  );
}
