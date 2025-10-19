import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortfolioPulse - Professional Market Analytics",
  description: "Real-time portfolio tracking with advanced analytics, market insights, and professional tools for traders and investors.",
  icons: {
    icon: "/assets/icons/portfoliopulse-premium-icon.svg",
    apple: "/assets/icons/portfoliopulse-premium-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
