import { Marck_Script, Inter, La_Belle_Aurore, Irish_Grover } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const runtime = 'edge';

const marckScript = Marck_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marck-script",
});

const laBelleAurore = La_Belle_Aurore({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-la-belle-aurore",
});

const irishGrover = Irish_Grover({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-irish-grover",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Naya Al-Khoury | Portfolio",
    template: "%s | Naya Al-Khoury",
  },
  description: "Explore the digital and traditional art portfolio of Naya Al-Khoury. Featuring illustrations, graphic design, animation, and motion graphics.",
  keywords: ["Naya Al-Khoury", "Portfolio", "Digital Art", "Illustration", "Graphic Design", "Animation", "Spacetoon Artist", "Fine Arts Damascus"],
  authors: [{ name: "Naya Al-Khoury" }],
  creator: "Naya Al-Khoury",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nayaalkhoury.com",
    siteName: "Naya Al-Khoury Portfolio",
    title: "Naya Al-Khoury | Digital & Traditional Artist",
    description: "Digital art, illustrations, graphic design and animation portfolio.",
    images: [
      {
        url: "/images/DigitalArt&Illustration.webp",
        width: 1200,
        height: 630,
        alt: "Naya Al-Khoury Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naya Al-Khoury | Portfolio",
    description: "Digital & Traditional Artist Portfolio",
    images: ["/images/DigitalArt&Illustration.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/vectors/naya_icon.png",
    apple: "/vectors/naya_icon.png",
  },
};

import ZoomManager from "../components/ZoomManager";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable} ${irishGrover.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable} ${irishGrover.variable} font-sans`}>
        <ZoomManager />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
