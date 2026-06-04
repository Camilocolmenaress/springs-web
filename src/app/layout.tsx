import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono, Playfair_Display, Caveat_Brush, Caveat } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "block",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["italic"],
  weight: ["700", "800"],
});

const caveatBrush = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
});

const caveat = Caveat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F2E8D5",
};

export const metadata: Metadata = {
  title: "SPRINGS — Jacket Potatoes",
  description:
    "Jacket potatoes con proteina santandereana. Domicilios en Bucaramanga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${caveatBrush.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=block" rel="stylesheet" />
      </head>
      <body className="overflow-hidden h-full">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
