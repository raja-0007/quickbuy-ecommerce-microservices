import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuickBuy",
  description:
    "QuickBuy is your trusted online store for electronics, fashion, home essentials, and more with secure checkout and fast delivery.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  // console.log("sesskion in server", session)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders token={session?.user?.accessToken || null}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
