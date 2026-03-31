"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/home_components/Navbar";
import { SearchProvider } from "@/contexts/searchProductsContext";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { SocketProvider } from "@/contexts/useSocket";

export default function ClientProviders({ children, token }) {
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <Provider store={store}>


          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            storageKey="theme"
          >
            <SessionProvider>
        <SocketProvider token={token}>
              <SearchProvider>
                <Suspense fallback={null}>
                  <Navbar />
                </Suspense>
                {children}
              </SearchProvider>
        </SocketProvider>
            </SessionProvider>
          </ThemeProvider>
      </Provider>
      <Toaster />
    </>
  );
}
