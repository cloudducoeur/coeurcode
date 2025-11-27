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
  title: "CoeurCode - Générateur de QR Code personnalisé",
  description: "Générez des QR codes personnalisés avec des presets Restos du Coeur, Radio Restos, Les Enfoirés, etc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>CoeurCode - Générateur de QR Code personnalisé</title>
        <meta name="description" content="Générez des QR codes personnalisés avec des presets Restos du Coeur, Radio Restos, Les Enfoirés, etc." />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
