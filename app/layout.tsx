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
  title: "Naya Al-Khoury | Portfolio",
  description: "Digital art, illustrations, graphic design and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable} ${irishGrover.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function applyZoom() {
                  if (window.innerWidth > 1024) {
                    // Check if 'zoom' is supported (Chrome, Safari, Edge)
                    if (document.body.style.zoom !== undefined) {
                      document.body.style.zoom = "75%";
                    } else {
                      // Fallback for Firefox
                      document.body.style.transform = "scale(0.75)";
                      document.body.style.transformOrigin = "top left";
                      document.body.style.width = "133.33%";
                    }
                  } else {
                    document.body.style.zoom = "100%";
                    document.body.style.transform = "none";
                    document.body.style.width = "100%";
                  }
                }
                // Apply on load
                applyZoom();
                window.addEventListener('resize', applyZoom);
              })();
            `,
          }}
        />
      </head>
      <body className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable} ${irishGrover.variable} font-sans`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
