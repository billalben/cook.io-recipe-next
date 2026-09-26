import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Snackbar } from "@/components/snackbar";
import { SITE_URL } from "@/lib/site";
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

const SITE_TITLE = "Cook.io — Discover Delicious Recipes";
const SITE_DESCRIPTION =
  "Browse thousands of recipes by meal type, cuisine, diet, and health preferences.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Cook.io",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=sessionStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-(--color-surface) text-(--color-on-surface) font-sans antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-(--header-height) pb-(--mobile-nav-height) md:pb-0">
            {children}
          </main>
          <Snackbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
