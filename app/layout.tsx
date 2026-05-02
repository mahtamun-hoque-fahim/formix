import type { Metadata } from "next";
import { Syne, Onest, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: { default: "Formify", template: "%s | Formify" },
  description: "Create, share, collect, and export form responses for your organization.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${syne.variable} ${onest.variable} ${jetbrainsMono.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
