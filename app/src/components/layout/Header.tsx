'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, Heart, Store } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore, useUser, useCartItemCount, useIsAdmin, useIsVendor, useWishlist } from '@/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const user = useUser();
  const isAdmin = useIsAdmin();
  const isVendor = useIsVendor();
  const cartItemCount = useCartItemCount();
  const { logout } = useAuthStore();
  const { toggleCart } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const wishlist = useWishlist();
  const wishlistCount = wishlist.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-cream-100/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      )}
    >
      {/* Top Bar */}
      <div className="bg-charcoal-100 text-cream-100 py-2 text-xs">
        <div className="container-elegant flex items-center justify-between">
          <p className="hidden sm:block">Free shipping on orders over $75</p>
          <div className="flex items-center gap-4 ml-auto">
            {mounted && (!user ? (
              <>
                <Link href="/login" className="hover:text-gold-100 transition-colors">
                  Sign In
                </Link>
                <span className="text-charcoal-50">|</span>
                <Link href="/register" className="hover:text-gold-100 transition-colors">
                  Create Account
                </Link>
              </>
            ) : (
              <span>Welcome, {user.displayName || 'Guest'}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-elegant py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 hover:bg-beige-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">N</span>
            </div>
            <span className="font-heading text-2xl font-semibold hidden sm:block">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-charcoal-100 hover:text-gold-100 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-100 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-beige-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-100/50 focus:border-gold-100 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-100/40" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search - Mobile */}
            <button
              onClick={() => router.push('/shop')}
              className="md:hidden p-2 hover:bg-beige-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => router.push('/wishlist')}
              className="hidden sm:flex relative p-2 hover:bg-beige-100 rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-beige-100 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-100 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {mounted && (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-beige-100 rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/wishlist')}>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  {isVendor && (
                    <DropdownMenuItem onClick={() => router.push('/vendor/dashboard')}>
                      <Store className="w-4 h-4 mr-2" />
                      Vendor Dashboard
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                      <Store className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[120px] bg-cream-100 z-40 animate-slide-down">
          <nav className="container-elegant py-6 flex flex-col gap-4">
            {NAV_LINKS.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium py-3 border-b border-beige-200"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-4 mt-4">
                <Button asChild className="flex-1">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
