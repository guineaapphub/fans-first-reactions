import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Fans First Reactions",
  description:
    "Privacy Policy for Fans First Reactions, an independent football creator directory owned and operated by Stephen Millar.",
};

const sections = [
  {
    title: "1. Information About Us",
    body: [
      "Fans First Reactions is owned and operated by Stephen Millar. Established in 2026, the website is an independent football creator directory dedicated to helping supporters discover football fan creators and communities across clubs and leagues.",
      "You can contact us by email at fansfirstreactions@gmail.com.",
      "Fans First Reactions is registered as a data controller with the UK Information Commissioner's Office. Our data protection registration reference is ZC191334.",
    ],
  },
  {
    title: "2. What This Policy Covers",
    body: [
      "This Privacy Policy explains how Fans First Reactions collects, uses, stores, and protects information when you use our website and related services.",
      "This policy applies only to Fans First Reactions. Our website may contain links to other websites, including YouTube, X, affiliate partners, and football-related services. We are not responsible for how those third-party websites handle your information.",
    ],
  },
  {
    title: "3. Information We Collect",
    body: [
      "We may collect account information such as your email address and authentication details when you create an account or sign in.",
      "Passwords are handled securely through Supabase Authentication and are not stored by Fans First Reactions in plain text.",
      "We may also store your favourite creators, creator submissions, contact messages, and basic technical information needed to operate, secure, and improve the website.",
    ],
  },
  {
    title: "4. Public Creator Information",
    body: [
      "Fans First Reactions displays publicly available creator information and information submitted directly by creators or authorised representatives.",
      "This may include YouTube channel names, public profile images, subscriber counts, public channel descriptions, supported clubs, leagues, handles, and public links.",
      "We do not access private YouTube account information.",
    ],
  },
  {
    title: "5. Data Sources",
    body: [
      "Fans First Reactions may use trusted third-party services and APIs to provide creator profiles, football fixture data, and website functionality.",
      "These may include YouTube API Services, API-Football, Supabase, Vercel, Google Search Console, and Google Analytics if enabled.",
      "Where data is obtained through public APIs, we aim to display information that is publicly available or voluntarily submitted.",
    ],
  },
  {
    title: "6. YouTube API Services",
    body: [
      "Fans First Reactions uses YouTube API Services to help display public creator information such as channel names, public profile images, public descriptions, handles, and subscriber counts.",
      "By using features powered by YouTube API Services, you are also subject to the YouTube Terms of Service and Google Privacy Policy.",
    ],
  },
  {
    title: "7. How We Use Information",
    body: [
      "We use information to operate the website, provide account features, save favourite creators, review creator submissions, prevent duplicate or abusive submissions, improve the service, and respond to enquiries.",
      "We may also use analytics to understand how visitors use the website and improve performance, content, and user experience.",
    ],
  },
  {
    title: "8. Lawful Basis Under UK GDPR",
    body: [
      "We process personal information where it is necessary to provide the service, where we have a legitimate interest in operating and improving the website, where we need to comply with legal obligations, or where you have given consent.",
    ],
  },
  {
    title: "9. Affiliate Links",
    body: [
      "Some links on Fans First Reactions may be affiliate links. This means Fans First Reactions may earn a commission if you purchase through those links, at no additional cost to you.",
      "Affiliate relationships do not affect creator listings, creator rankings, or whether a creator is approved for the directory.",
    ],
  },
  {
    title: "10. Sharing Information",
    body: [
      "We do not sell your personal information.",
      "We may share limited information with trusted service providers where needed to operate the website, including Supabase, Vercel, email providers, analytics providers, and API providers.",
      "We may also disclose information if required by law, regulation, court order, or a lawful request from an authority.",
    ],
  },
  {
    title: "11. Cookies",
    body: [
      "Fans First Reactions may use cookies and similar technologies for essential website functions, authentication, security, analytics, and performance.",
      "You can control cookies through your browser settings, although some essential features may not work correctly if cookies are disabled.",
    ],
  },
  {
    title: "12. Data Retention",
    body: [
      "We keep personal information only for as long as necessary to operate the website, provide account features, comply with legal obligations, resolve disputes, and maintain security.",
      "If you request account deletion, we will delete or anonymise your personal data where legally and technically possible.",
    ],
  },
  {
    title: "13. Your Rights",
    body: [
      "Under UK data protection law, you may have rights to access, correct, delete, restrict, or object to the use of your personal information.",
      "You may also request a copy of certain personal data in a portable format where applicable.",
      "To exercise these rights, contact fansfirstreactions@gmail.com.",
    ],
  },
  {
    title: "14. Creator Updates and Removal Requests",
    body: [
      "If you are a creator listed on Fans First Reactions and would like your profile updated, corrected, verified, or removed, contact fansfirstreactions@gmail.com.",
      "We will review reasonable requests and update or remove information where appropriate.",
    ],
  },
  {
    title: "15. Security",
    body: [
      "We use reasonable technical and organisational measures to protect information, including HTTPS, secure hosting, Supabase Authentication, and access controls.",
      "No online service can guarantee complete security, but we work to protect the information we handle.",
    ],
  },
  {
    title: "16. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The latest version will always be available on this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#67e1f9]">
            Legal
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Privacy Policy
          </h1>

          <p className="mt-5 text-lg text-gray-400">
            Last updated: 8 July 2026
          </p>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-300">
            This Privacy Policy explains how Fans First Reactions collects,
            uses, stores, and protects information when you use our website and
            related services.
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
          <h2 className="text-3xl font-black">Privacy Contact</h2>
          <p className="mt-3 text-lg">
            For privacy questions, account deletion, creator removal requests,
            or data rights requests, contact:
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