import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SEPLAG - SEAPS",
  description: "Sistema de Manutenção Predial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={["dark", "light"]}
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Toaster closeButton richColors />
      </body>
    </html>
  );
}
