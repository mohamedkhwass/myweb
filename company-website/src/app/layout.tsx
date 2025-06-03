import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Khwass Tech",
  description: "شركة متخصصة في تطوير التطبيقات الجوالة والحلول التقنية المبتكرة. نقدم خدمات تطوير Flutter وتطبيقات Android مع التركيز على الجودة والابتكار.",
  keywords: "تطوير التطبيقات, Flutter, Android, حلول تقنية, شركة برمجة, تطبيقات جوالة, تطوير مواقع",
  authors: [{ name: "Khwass Tech" }],
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180' },
      { url: '/logo.png', sizes: '152x152' },
      { url: '/logo.png', sizes: '120x120' }
    ]
  },
  openGraph: {
    title: "Khwass Tech | حلول تقنية مبتكرة",
    description: "شركة متخصصة في تطوير التطبيقات الجوالة والحلول التقنية المبتكرة",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khwass Tech",
    description: "حلول تقنية مبتكرة وتطوير تطبيقات احترافية",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Khwass Tech" />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
