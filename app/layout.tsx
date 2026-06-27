import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
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
  title: "Fans First Reactions",
  description: "Creator database for football fan channels.",
};

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-8 text-center text-sm text-zinc-500">
      <div className="mx-auto max-w-5xl space-y-4">
        <p>© 2026 FanFirstReactions.com</p>

        <p>
          Club crests, logos, trademarks, and team names are the property of
          their respective owners and are used here for identification and
          informational purposes only.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}