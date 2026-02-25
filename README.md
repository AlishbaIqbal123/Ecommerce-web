# 🌙 NoorMarket - Premium Islamic E-Commerce Platform


https://github.com/user-attachments/assets/55dea66c-d0e8-4f29-bf03-2420fe2aaa75

NoorMarket is a sophisticated, "Pinterest-coded" e-commerce ecosystem designed specifically for the global Islamic lifestyle market. It bridges the gap between traditional values and modern technology, providing an elegant platform for artisans, scholars, and businesses to reach a global audience.

Built with **Next.js 15**, **TypeScript**, and **Firebase**, NoorMarket offers a state-of-the-art shopping experience with a focus on premium aesthetics, security, and performance.

---

## 💎 The E-Commerce Experience

### �️ For Customers
*   **Elegant Discovery**: Browse curated collections of Prayer Essentials, Modest Fashion, Home Decor, and more.
*   **Pinterest-Inspired Design**: A smooth, responsive UI featuring glassmorphism, gold accents, and fluid animations.
*   **Advanced Filtering**: Filter by category, price range, ratings, and stock status using optimized Firestore composite indexes.
*   **Persistent Shopping**: A robust cart and wishlist system that remembers your choices even after a page refresh (powered by Zustand & LocalStorage).
*   **Secure Checkout**: Integrated with Stripe for seamless and secure international payments.

### 🎨 For Vendors
*   **Dedicated Storefront**: Unique vendor pages to showcase business identity and ratings.
*   **Craftsman Dashboard**: Manage product inventory, track orders in real-time, and monitor sales performance.
*   **Role-Based Security**: Complete isolation of vendor data ensuring privacy and security.

### �️ For Administrators
*   **Global Oversight**: Monitor total platform sales, registered users, and product inventory.
*   **Vendor Moderation**: A streamlined workflow to review, approve, or suspend vendor applications.
*   **User Management**: Promote users to admin roles or manage platform access.

---

## 🛠️ Technology Stack

NoorMarket uses a modern, high-performance stack:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) | App Router, SSR, and optimized performance. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety. |
| **Database** | [Firestore](https://firebase.google.com/products/firestore) | Real-time, scalable NoSQL document database. |
| **Auth** | [Firebase Auth](https://firebase.google.com/products/auth) | Google & Email/Password secure authentication. |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight global state management. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Custom design system with "Gold/Charcoal" palette. |
| **Payments** | [Stripe](https://stripe.com/) | Secure payment intent and checkout integration. |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, elegant iconography. |

---

## 📁 Repository Structure

```text
├── app/                  # The heart of the project (Next.js)
│   ├── src/
│   │   ├── app/          # Pages, API routes, and layouts
│   │   ├── components/   # UI components (Shadcn-based)
│   │   ├── lib/          # Firebase config, Firestore services, Utils
│   │   ├── store/        # Zustand stores for Cart, Auth, Vendor, etc.
│   │   └── types/        # TypeScript interfaces
│   ├── public/           # Optimized local images and brand assets
│   ├── firestore.rules   # Security protocols for data protection
│   └── firestore.indexes.json # Performance indexes for complex queries
└── ARCHITECTURE.md       # Deep dive into the system design
```

---

## 🚀 Quick Setup

### 1. Prerequisites
*   Node.js v18.x or higher.
*   A Firebase project (Free Tier works perfectly).
*   A Stripe account for payment testing.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/AlishbaIqbal123/Ecommerce-web.git

# Navigate to the app directory
cd Ecommerce-web/app

# Install dependencies
npm install
```

### 3. Environment Config
Create a `.env` file in the `/app` folder:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 4. Run Development
```bash
npm run dev
```

---

## 🔐 Security & Reliability

*   **Firestore Rules**: We implement strict Server-Side security rules to ensure and protect vendor/user data.
*   **Versioned APIs**: Stripe integration uses the stable clover API for long-term reliability.
*   **Data Integrity**: Sanitized data structures prevent malicious injections or malformed database entries.

---

## 🤝 Contribution

Contributions make the Islamic tech ecosystem stronger.
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

---

Developed with dedication for the **NoorMarket** community.
**Project Link**: [https://github.com/AlishbaIqbal123/Ecommerce-web](https://github.com/AlishbaIqbal123/Ecommerce-web)
