import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Fans First Reactions",
  description:
    "Terms of Service for Fans First Reactions, an independent football creator directory.",
};

const sections = [
  {
    title: "1. About Fans First Reactions",
    body: [
      "Fans First Reactions is an independent football creator directory that helps supporters discover football content creators, fan channels, communities, and related football resources.",
      "The website is owned and operated by Stephen Millar. You can contact us at fansfirstreactions@gmail.com.",
    ],
  },
  {
    title: "2. Acceptance of These Terms",
    body: [
      "By using Fans First Reactions, you agree to these Terms of Service. If you do not agree with these terms, you should not use the website.",
      "We may update these terms from time to time. The latest version will always be available on this page.",
    ],
  },
  {
    title: "3. Independent Directory",
    body: [
      "Fans First Reactions is not affiliated with, endorsed by, or officially connected to any football club, league, governing body, YouTube creator, or platform unless clearly stated.",
      "Club names, team names, crests, logos, trademarks, and related branding belong to their respective owners and are used here for identification and informational purposes only.",
    ],
  },
  {
    title: "4. Public Creator Information",
    body: [
      "Fans First Reactions may display publicly available information about football content creators, including channel names, profile images, subscriber counts, descriptions, handles, public links, clubs, and leagues.",
      "We may also display information submitted directly by creators or authorised representatives.",
      "If you are a creator or authorised representative and would like your profile updated, corrected, verified, or removed, please contact fansfirstreactions@gmail.com.",
    ],
  },
  {
    title: "5. Creator Submissions",
    body: [
      "Users may submit creator channels for review. Submitting a creator does not guarantee that the creator will be added to the directory.",
      "We may approve, reject, edit, remove, or update submissions at our discretion.",
      "You must not submit false, misleading, abusive, spam, harmful, or unauthorised information.",
    ],
  },
  {
    title: "6. User Accounts",
    body: [
      "Some features may require an account, including saving favourite creators.",
      "You are responsible for keeping your account details secure and for any activity that takes place through your account.",
      "We may suspend or remove access if an account is used abusively, fraudulently, or in a way that harms the website or other users.",
    ],
  },
  {
    title: "7. Creator Guide and Resources",
    body: [
      "Fans First Reactions may provide guides and resources to help football creators build a professional watchalong or reaction channel setup.",
      "These resources may cover software, overlays, equipment, branding, monetisation, and other creator tools.",
      "The guide is provided for general information only. We do not guarantee specific results, income, audience growth, or platform approval.",
    ],
  },
  {
    title: "8. Affiliate Links",
    body: [
      "Some links on Fans First Reactions may be affiliate links. This means Fans First Reactions may earn a commission if you purchase through those links, at no additional cost to you.",
      "Affiliate links do not affect whether a creator is listed, approved, ranked, or displayed on the website.",
      "Purchases through third-party websites are between you and the third-party provider. Fans First Reactions is not responsible for third-party products, services, prices, refunds, or support.",
    ],
  },
  {
    title: "9. Third-Party Services and APIs",
    body: [
      "Fans First Reactions may use third-party services and APIs, including YouTube API Services, API-Football, Supabase, Vercel, and analytics tools.",
      "Third-party data may occasionally be incomplete, delayed, unavailable, or inaccurate.",
      "We aim to keep information useful and up to date, but we do not guarantee that all data on the website will always be complete or error-free.",
    ],
  },
  {
    title: "10. YouTube API Services",
    body: [
      "Fans First Reactions uses YouTube API Services to display public creator information.",
      "By using features powered by YouTube API Services, you also agree to be bound by the YouTube Terms of Service and Google Privacy Policy.",
    ],
  },
  {
    title: "11. Acceptable Use",
    body: [
      "You must not use Fans First Reactions to submit spam, scrape the website unlawfully, attack the service, upload malicious content, impersonate another person, or interfere with the normal operation of the website.",
      "You must not use the website in a way that infringes copyright, trademarks, privacy rights, or any other rights belonging to others.",
    ],
  },
  {
    title: "12. Accuracy and Availability",
    body: [
      "Fans First Reactions is provided on an as-is and as-available basis.",
      "We may update, remove, correct, or change content at any time.",
      "We do not guarantee that the website will always be available, uninterrupted, secure, or free from errors.",
    ],
  },
  {
    title: "13. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Fans First Reactions is not responsible for losses arising from your use of the website, reliance on information shown on the website, third-party links, third-party services, or temporary website unavailability.",
      "Nothing in these terms excludes liability where it cannot legally be excluded.",
    ],
  },
  {
    title: "14. Copyright and Takedown Requests",
    body: [
      "If you believe content on Fans First Reactions infringes your copyright, trademark, privacy, or other rights, please contact fansfirstreactions@gmail.com with clear details of the issue.",
      "We will review genuine requests and update or remove content where appropriate.",
    ],
  },
  {
    title: "15. Governing Law",
    body: [
      "These terms are governed by the laws of England and Wales.",
      "Any disputes will be handled under the jurisdiction of the courts of England and Wales, unless applicable law requires otherwise.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#67e1f9]">
            Legal
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Terms of Service
          </h1>

          <p className="mt-5 text-lg text-gray-400">
            Last updated: 8 July 2026
          </p>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-300">
            These Terms of Service explain the rules for using Fans First
            Reactions and the services, pages, creator listings, and resources
            available on the website.
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
          <h2 className="text-3xl font-black">Questions About These Terms?</h2>
          <p className="mt-3 text-lg">
            Contact Fans First Reactions at:
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