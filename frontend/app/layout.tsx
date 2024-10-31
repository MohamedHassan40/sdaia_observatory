import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import MobileNavbar from "@/components/custom/MobileNavbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const helvetica = localFont({
  src: [
    {
      path: "../public/fonts/helvetica-light.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-roman.woff2",
      weight: "600",
      style: "normal",
    },

    {
      path: "../public/fonts/helvetica-bold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "AI Observatory",
  description:
    "AI Observatory is a platform that provides insights on AI readiness and AI country profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navbar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <MobileNavbar />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
