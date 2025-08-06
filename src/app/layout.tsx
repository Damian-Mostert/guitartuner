"use client";

import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { TunerProvider } from "@/context/TunerContext";
import { useEffect } from "react";

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
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered');

          // Delay to ensure service worker is active
          setTimeout(() => {
            const urlsToCache = Array.from(document.querySelectorAll('link, script'))
              .map((el) => el.getAttribute('href') || el.getAttribute('src'))
              .filter((src) => src && (src.startsWith('/_next/') || src.includes('fonts') || src.includes('.css')))
              .map((src) => src?new URL(src, location.origin).href:new URL(location.origin).href);

            console.log('[SW] Sending dynamic URLs to cache:', urlsToCache);

            if (registration.active) {
              registration.active.postMessage({
                type: 'CACHE_URLS',
                payload: urlsToCache,
              });
            }
          }, 2000); // Slight delay to ensure DOM is loaded
        })
        .catch((err) => console.error('[SW] Registration failed', err));
    }
  }, []);
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
