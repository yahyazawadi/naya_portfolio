import { Marck_Script, Inter, La_Belle_Aurore } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
    <html lang="en" className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable}`}>
      <body className={`${marckScript.variable} ${laBelleAurore.variable} ${inter.variable} font-sans`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
