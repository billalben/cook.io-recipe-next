import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Snackbar } from "@/components/snackbar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Cook.io — Discover Delicious Recipes",
  description:
    "Browse thousands of recipes by meal type, cuisine, diet, and health preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[var(--color-surface)] text-[var(--color-on-surface)] font-sans antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-[var(--header-height)] pb-[var(--mobile-nav-height)] md:pb-0">
            {children}
          </main>
          <Snackbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
