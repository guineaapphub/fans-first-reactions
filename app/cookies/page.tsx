import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Fans First Reactions",
  description:
    "Cookie Policy for Fans First Reactions, explaining how cookies and similar technologies may be used.",
};

const sections = [
  {
    title: "1. What Cookies Are",
    body: [
      "Cookies are small files stored on your device when you visit a website. They help websites remember information, keep users signed in, improve security, and understand how visitors use the site.",
    ],
  },
  {
    title: "2. How Fans First Reactions Uses Cookies",
    body: [
      "Fans First Reactions may use cookies and similar technologies to operate the website, support account features, improve performance, protect against misuse, and understand how visitors use the service.",
    ],
  },
  {
    title: "3. Essential Cookies",
    body: [
      "Essential cookies are required for core website features to work properly. These may include authentication, account sessions, security, and basic website functionality.",
      "These cookies cannot usually be disabled without affecting how the website works.",
    ],
  },
  {
    title: "4. Authentication Cookies",
    body: [
      "If you create an account or sign in, Supabase Authentication may use cookies or similar storage technologies to keep you signed in and protect your account session.",
      "These are used only to provide account-related features such as sign-in, sign-out, favourites, and account security.",
    ],
  },
  {
    title: "5. Analytics Cookies",
    body: [
      "Fans First Reactions may use analytics tools, such as Google Analytics, to understand how visitors use the website.",
      "Analytics may help us understand page visits, general location information, device type, browser type, and user interaction patterns.",
      "Analytics information is used to improve the website and does not directly identify you to Fans First Reactions.",
    ],
  },
  {
    title: "6. Affiliate and Third-Party Links",
    body: [
      "Some links on Fans First Reactions may take you to affiliate partners or third-party websites.",
      "Those websites may use their own cookies, tracking technologies, and privacy practices. Fans First Reactions does not control cookies used by third-party websites after you leave our site.",
    ],
  },
  {
    title: "7. Embedded and External Services",
    body: [
      "The website may link to or use external services such as YouTube, X, API providers, analytics tools, and hosting providers.",
      "These services may use cookies or similar technologies according to their own policies.",
    ],
  },
  {
    title: "8. Managing Cookies",
    body: [
      "You can manage or block cookies through your browser settings.",
      "Most browsers allow you to delete cookies, block cookies, or receive a warning before cookies are stored.",
      "If you disable some cookies, certain website features may not work correctly, including sign-in and account features.",
    ],
  },
  {
    title: "9. Changes to This Cookie Policy",
    body: [
      "We may update this Cookie Policy from time to time. The latest version will always be available on this page.",
    ],
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#67e1f9]">
            Legal
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Cookie Policy
          </h1>

          <p className="mt-5 text-lg text-gray-400">
            Last updated: 8 July 2026
          </p>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-300">
            This Cookie Policy explains how Fans First Reactions may use cookies
            and similar technologies to operate and improve the website.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 md:px-12">
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-[28px] border border-[#67e1f9]/25 bg-[#0c1020] p-7"
            >
              <h2 className="text-2xl font-black text-white">
                {section.title}
              </h2>

              <div className="mt-5 space-y-4 text-lg leading-relaxed text-gray-400">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] bg-[#67e1f9] p-8 text-black">
          <h2 className="text-3xl font-black">Cookie Questions</h2>
          <p className="mt-3 text-lg">
            For questions about cookies or privacy, contact:
          </p>
          <p className="mt-4 text-xl font-black">
            fansfirstreactions@gmail.com
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-black px-7 py-4 font-black text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}