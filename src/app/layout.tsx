import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CookSmart India - India's Smart Recipe Finder",
  description: "Discover delicious Indian recipes based on what's in your fridge. Save time, money, and cook healthier meals with CookSmart India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col pt-0 pb-16 md:pb-0`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
            {children}
          </main>
          <BottomNav />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
