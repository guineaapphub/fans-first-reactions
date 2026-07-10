import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import "./globals.css";

const siteUrl = "https://www.fansfirstreactions.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

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

  authors: [
    {
      name: "Fans First Reactions",
    },
  ],

  creator: "Fans First Reactions",
  publisher: "Fans First Reactions",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title: "Fans First Reactions",

    description:
      "Discover football fan reaction creators, supporter channels, club pages, match fixtures, and YouTube description tools.",

    url: siteUrl,
    siteName: "Fans First Reactions",
    type: "website",
    locale: "en_GB",

    // Keep the current social image because your WhatsApp
    // and iMessage previews are already working correctly.
    images: [
      {
        url: `${siteUrl}/f1r-logo.png`,
        width: 512,
        height: 512,
        alt: "Fans First Reactions logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Fans First Reactions",

    description:
      "Discover football fan reaction creators, supporter channels, club pages, match fixtures, and YouTube description tools.",

    // Keep the current social image.
    images: [`${siteUrl}/f1r-logo.png`],
  },

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],

    shortcut: ["/favicon.ico"],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
  },
};

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/copyright", label: "Copyright & Creator Requests" },
  { href: "/contact", label: "Contact" },
];

const jsonLd = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Fans First Reactions",
      url: siteUrl,
      logo: `${siteUrl}/f1r-logo.png`,

      sameAs: [
        "https://www.youtube.com/@FansFirstReactions",
        "https://x.com/Fans1R",
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Fans First Reactions",

      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },

    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapplication`,
      name: "Fans First Reactions",
      url: siteUrl,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "All",

      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-10 text-sm text-zinc-500">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-3">
              <Image
                src="/f1r-logo.png"
                alt="Fans First Reactions"
                width={46}
                height={46}
                className="rounded-xl"
              />

              <h2 className="text-lg font-black text-white">
                Fans <span className="text-[#67e1f9]">First</span> Reactions
              </h2>
            </div>

            <p className="max-w-3xl leading-relaxed">
              Fans First Reactions is an independent football creator
              directory that helps supporters discover football content
              creators and communities from across clubs and leagues.
            </p>

            <p className="max-w-3xl leading-relaxed">
              We also provide a Creator Guide that walks creators through
              building a professional football watchalong or reaction channel
              setup, including software, overlays, equipment, branding, and
              monetisation.
            </p>

            <p className="max-w-3xl leading-relaxed">
              We index publicly available creator information for discovery
              purposes. If you&apos;re a creator and would like your profile
              updated, corrected, or removed, please visit our{" "}
              <Link
                href="/copyright"
                className="font-bold text-[#67e1f9] hover:underline"
              >
                Copyright & Creator Requests
              </Link>{" "}
              page or{" "}
              <Link
                href="/contact"
                className="font-bold text-[#67e1f9] hover:underline"
              >
                contact us
              </Link>
              .
            </p>
          </div>

          <div className="text-left md:text-right">
            <h2 className="text-lg font-black uppercase tracking-[0.25em] text-[#67e1f9]">
              Legal
            </h2>

            <nav className="mt-5 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-bold text-zinc-400 hover:text-[#67e1f9]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 rounded-[32px] border border-[#67e1f9]/30 bg-[#0c1020] px-6 py-10 text-center md:px-10">
          <h3 className="text-3xl font-black text-white md:text-4xl">
            Looking to start your football channel?
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-zinc-400">
            Submit your football reaction or watchalong channel to Fans First
            Reactions and get discovered by football fans worldwide.
          </p>

          <Link
            href="/become-a-creator"
            className="mt-7 inline-flex min-w-[230px] justify-center rounded-full bg-[#67e1f9] px-8 py-4 text-lg font-black text-black hover:bg-white"
          >
            Submit Your Channel
          </Link>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p>© 2026 FanFirstReactions.com</p>

          <p className="mx-auto mt-3 max-w-4xl leading-relaxed">
            The independent football creator directory. Maintained by Fans
            First Reactions. Built with the football community.
          </p>

          <p className="mx-auto mt-4 max-w-4xl leading-relaxed">
            Club crests, logos, trademarks, and team names are the property of
            their respective owners and are used here for identification and
            informational purposes only.
          </p>
        </div>
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GKW4DGHPYG"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', 'G-GKW4DGHPYG');
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}