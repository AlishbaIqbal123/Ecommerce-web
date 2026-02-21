import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "@/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "NoorMarket | Premium Islamic Lifestyle Marketplace",
    description: "Discover a curated collection of modest fashion, home decor, and intentional living products.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col bg-cream-100`}>
                <Providers>
                    <Header />
                    <main className="flex-1 pt-[120px]">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
