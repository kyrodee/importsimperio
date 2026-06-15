import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/supabase/env";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Império Imports | Produtos importados originais",
    template: "%s | Império Imports",
  },
  description:
    "Catálogo premium de produtos importados originais dos EUA e Paraguai, em estoque e sob encomenda.",
  keywords: [
    "Império Imports",
    "produtos importados",
    "Paraguai",
    "Estados Unidos",
    "eletronicos importados",
    "perfumaria importada",
    "catalogo de importados",
  ],
  authors: [{ name: "Império Imports" }],
  creator: "Império Imports",
  publisher: "Império Imports",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: getSiteUrl(),
    siteName: "Império Imports",
    title: "Império Imports | Produtos importados originais",
    description:
      "Produtos originais dos EUA e Paraguai com procedencia, estoque e encomendas.",
    images: [
      {
        url: "/images/hero-imports.png",
        width: 1600,
        height: 900,
        alt: "Produtos importados premium organizados sobre fundo preto.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Império Imports | Produtos importados originais",
    description:
      "Catalogo premium de importados originais dos EUA e Paraguai.",
    images: ["/images/hero-imports.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistMono.variable} font-semibold font-sans bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
