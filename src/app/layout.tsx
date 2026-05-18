import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono, Playfair_Display, Permanent_Marker } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
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

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
});

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
      className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${permanentMarker.variable} h-full antialiased`}
    >
      <body className="overflow-hidden h-full">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
