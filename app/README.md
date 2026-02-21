# NoorMarket - Premium Islamic E-Commerce Platform

NoorMarket is a state-of-the-art, premium e-commerce application specialized in Islamic lifestyle products. Built with **Next.js**, **TypeScript**, and **Firebase**, it features a sophisticated design system, robust backend integration, and a seamless shopping experience.

## ✨ Key Features

- **Premium Aesthetics**: A "Pinterest-coded" elegant UI with smooth animations, custom gold accents, and a responsive layout.
- **Local Asset Management**: Hand-picked, high-quality, and colorful image assets stored locally for fast loading and 100% reliability.
- **Full Firebase Integration**:
  - **Authentication**: Secure Google and Email/Password login.
  - **Firestore**: Real-time database for products, categories, reviews, and orders.
  - **Advanced Filtering**: Use of Firestore composite indexes for complex price, rating, and category filtering.
- **Shopping Experience**:
  - **Dynamic Cart**: Persistent cart state managed with Zustand.
  - **Wishlist**: Save favorite products across sessions.
  - **Stripe Integration**: Secure checkout with support for the latest Stripe API protocols.
- **Management Dashboards**:
  - **Admin Panel**: Comprehensive dashboard to approve vendors, manage users, and monitor global sales.
  - **Vendor Dashboard**: Dedicated space for artisans to manage their inventory, track orders, and view performance.
- **Product Reviews**: Customer feedback system with rating support and admin moderation.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database / Auth**: Firebase (Firestore, Authentication)
- **Payments**: Stripe SDK
- **Icons**: Lucide React
- **UI Components**: Radix UI + Custom Glassmorphism components

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Firebase Account
- Stripe Account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlishbaIqbal123/Ecommerce-web.git
   cd Ecommerce-web/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `app` directory with your credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router (Pages & API Routes)
├── components/     # UI Components (auth, layout, products, vendors)
├── lib/           # Core Logic (Firebase service, Stripe config, Utils)
├── store/         # Zustand Stores (Auth, Cart, Product, UI, Vendor)
├── types/         # TypeScript Interfaces
└── public/        # Optimized Image Assets & Icons
```

## 🔐 Database Rules & Indexes

Detailed security rules and composite indexes are included in the repository:
- `firestore.rules`: Secure access control for Users, Vendors, and Admins.
- `firestore.indexes.json`: Optimized indexes for advanced product filtering.

## 🤝 Contributing

We welcome contributions!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the NoorMarket Team.
