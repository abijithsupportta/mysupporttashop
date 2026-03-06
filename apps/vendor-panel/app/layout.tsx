import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const bodyFont = Sora({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "MySupporttaShop Vendor Panel",
  description: "Vendor operations panel for MySupporttaShop"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
