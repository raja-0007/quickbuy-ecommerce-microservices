"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/home_components/Navbar";
import { SearchProvider } from "@/contexts/searchProductsContext";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

export default function ClientProviders({ children }) {
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        storageKey="theme"
      >
        <SessionProvider>
          <SearchProvider>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            {children}
          </SearchProvider>
        </SessionProvider>
      </ThemeProvider>
      <Toaster />
    </>
  );
}
