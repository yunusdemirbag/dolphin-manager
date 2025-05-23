import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '../components/Providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dolphin Manager",
  description: "Etsy Store Management for Canvas Wall Art Sellers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
