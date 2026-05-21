import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TruckBilty — Enterprise Transport Management",
    template: "%s | TruckBilty",
  },
  description:
    "TruckBilty is an enterprise-grade Transport Management SaaS for fleet owners, freight brokers, and logistics operators.",
  keywords: ["transport management", "bilty", "LR", "freight", "logistics", "ERP"],
  authors: [{ name: "TruckBilty" }],
  themeColor: "#050810",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-dark-900 text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
