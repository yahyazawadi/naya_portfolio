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
    default: "Naya Al-Khoury | Digital & Traditional Artist | Portfolio",
    template: "%s | Naya Al-Khoury",
  },
  description: "Official portfolio of Naya Al-Khoury. Specializing in digital illustrations, traditional art, graphic design, and animation. Experience stories told through vibrant visual art.",
  keywords: ["Naya Al-Khoury", "Artist Portfolio", "Digital Art Damascus", "Traditional Illustration", "Graphic Designer Syria", "Motion Graphics", "Spacetoon Storyboard Artist", "Fine Arts Damascus"],
  authors: [{ name: "Naya Al-Khoury" }],
  creator: "Naya Al-Khoury",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nayaalkhoury.com",
    siteName: "Naya Al-Khoury Portfolio",
    title: "Naya Al-Khoury | Digital & Traditional Artist",
    description: "Explore the artistic world of Naya Al-Khoury: Digital illustrations, traditional crafts, graphic design, and motion graphics.",
    images: [
      {
        url: "/images/DigitalArt&Illustration.webp",
        width: 1200,
        height: 630,
        alt: "Naya Al-Khoury Art Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naya Al-Khoury | Artist Portfolio",
    description: "Digital & Traditional Art, Illustration, Graphic Design, and Animation.",
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
    <html lang="en" className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable} ${irishGrover.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable} ${irishGrover.variable} font-sans`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var width = window.innerWidth;
                  var isMobile = width <= 1024;
                  var scale = isMobile ? "85%" : "75%";
                  var fallbackWidth = isMobile ? "117.647%" : "133.333%";
                  
                  if (document.body.style.zoom !== undefined) {
                    document.body.style.zoom = scale;
                  } else {
                    document.body.style.transform = "scale(" + (isMobile ? 0.85 : 0.75) + ")";
                    document.body.style.transformOrigin = "top left";
                    document.body.style.width = fallbackWidth;
                  }
                  document.documentElement.style.overflowX = "hidden";
                  document.body.style.overflowX = "hidden";

                  // ── Image & Site Protection ──
                  // Treat right-click as a left-click
                  document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    // Dispatch a fake click event to the target
                    var clickEvent = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true,
                      clientX: e.clientX,
                      clientY: e.clientY
                    });
                    e.target.dispatchEvent(clickEvent);
                  }, false);

                  document.addEventListener('dragstart', function(e) {
                    if (e.target.tagName === 'IMG') e.preventDefault();
                  }, false);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ZoomManager />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
