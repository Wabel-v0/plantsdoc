import type React from "react";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";

// Remove the Inter constant
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plants Doc - AI Plant Disease Diagnosis",
  description: "Intelligent plant disease diagnosis tool powered by AI",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Remove the inter.className from body */}
      <body suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

import "./globals.css";
