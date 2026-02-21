import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';
import { APP_NAME, NAV_LINKS, SOCIAL_LINKS, SUPPORT_EMAIL, SUPPORT_PHONE } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-charcoal-100 text-cream-100">
      {/* Features Bar */}
      <div className="border-b border-charcoal-50/20">
        <div className="container-elegant py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-100/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-gold-100" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-cream-100/60">On orders over $75</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-100/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-gold-100" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-cream-100/60">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-100/20 rounded-full flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-gold-100" />
              </div>
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-cream-100/60">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-100/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-gold-100" />
              </div>
              <div>
                <p className="font-medium text-sm">Gift Cards</p>
                <p className="text-xs text-cream-100/60">Perfect for loved ones</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-elegant py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">N</span>
              </div>
              <span className="font-heading text-2xl font-semibold">{APP_NAME}</span>
            </Link>
            <p className="text-cream-100/70 text-sm mb-6 max-w-sm">
              Your premier destination for Islamic products including prayer essentials,
              home decor, modest fashion, books, and more. Discover treasures for your home and heart.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-3 text-sm text-cream-100/70 hover:text-gold-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {SUPPORT_EMAIL}
              </a>
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="flex items-center gap-3 text-sm text-cream-100/70 hover:text-gold-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {SUPPORT_PHONE}
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal-50/20 rounded-full flex items-center justify-center hover:bg-gold-100 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal-50/20 rounded-full flex items-center justify-center hover:bg-gold-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal-50/20 rounded-full flex items-center justify-center hover:bg-gold-100 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal-50/20 rounded-full flex items-center justify-center hover:bg-gold-100 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {NAV_LINKS.footer.map((section) => (
            <div key={section.title}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-100/70 hover:text-gold-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-50/20">
        <div className="container-elegant py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cream-100/50">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-cream-100/50 hover:text-gold-100 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-cream-100/50 hover:text-gold-100 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-cream-100/50 hover:text-gold-100 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
