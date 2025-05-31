import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "محمد علي خواص - مهندس برمجيات | Portfolio",
  description: "مطور Flutter متحمس مع خلفية في تطوير Android. متخصص في Flutter, Dart, Firebase, Java. أقوم بتطوير تطبيقات جوال حديثة وقوية.",
  keywords: "مطور Flutter, مهندس برمجيات, Android, Dart, Firebase, Java, تطبيقات الجوال, Portfolio",
  authors: [{ name: "محمد علي خواص" }],
  openGraph: {
    title: "محمد علي خواص - مهندس برمجيات | Portfolio",
    description: "مطور Flutter متخصص في تطوير التطبيقات الجوال",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
