import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: 'Tiledrop', template: '%s | Tiledrop' },
  description: "Build a bento grid portfolio that actually shows who you are. Drag, drop, share.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://tiledrop.vercel.app'),
  openGraph: {
    siteName: 'Tiledrop',
    type: 'website',
  },
  twitter: { card: 'summary' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
