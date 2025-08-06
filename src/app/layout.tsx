"use client";

import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { TunerProvider } from "@/context/TunerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TunerProvider>
          {children}
        </TunerProvider>
      </body>
    </html>
  );
}
