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
  metadataBase: new URL("https://fansfirstreactions.com"),
  title: {
    default: "Fans First Reactions",
    template: "%s | Fans First Reactions",
  },
  description:
    "Discover football fan reaction creators, supporter channels, club pages, match fixtures, and YouTube description tools for football content.",
  keywords: [
    "football fan reactions",
    "football reaction channels",
    "football creators",
    "football fan channels",
    "football fixtures",
    "YouTube football reactions",
    "Fans First Reactions",
  ],
  applicationName: "Fans First Reactions",
  authors: [{ name: "Fans First Reactions" }],
  creator: "Fans First Reactions",
  publisher: "Fans First Reactions",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fans First Reactions",
    description:
      "Discover football fan reaction creators, supporter channels, club pages, match fixtures, and YouTube description tools.",
    url: "https://fansfirstreactions.com",
    siteName: "Fans First Reactions",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fans First Reactions",
    description:
      "Discover football fan reaction creators, supporter channels, club pages, match fixtures, and YouTube description tools.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
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