import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/navigation/main-nav";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import type { ReactNode } from "react";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata: Metadata = {
  title: "SpecChem Safety LMS",
  description:
    "SpecChem Safety Learning Management System - Comprehensive safety training for industrial excellence",
  keywords: [
    "safety",
    "training",
    "LMS",
    "SpecChem",
    "industrial",
    "compliance",
  ],
  authors: [{ name: "SpecChem" }],
  viewport: "width=device-width, initial-scale=1",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-white">
          <MainNav />
          <div className="border-b bg-neutral-50">
            <div className="container mx-auto px-4">
              <Breadcrumb className="py-4" />
            </div>
          </div>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
