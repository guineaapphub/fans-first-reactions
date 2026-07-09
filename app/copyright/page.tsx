import Link from "next/link";

export const metadata = {
  title: "Copyright & Creator Requests | Fans First Reactions",
  description:
    "Copyright, trademark, creator profile update, correction, and removal request information for Fans First Reactions.",
};

const sections = [
  {
    title: "1. Copyright & Creator Requests",
    body: [
      "Fans First Reactions respects copyright, trademarks, creator rights, and intellectual property.",
      "This page explains how creators, rights holders, clubs, brands, or authorised representatives can contact us about profile updates, corrections, removals, copyright issues, or trademark concerns.",
    ],
  },
  {
    title: "2. Independent Directory",
    body: [
      "Fans First Reactions is an independent football creator directory. We are not affiliated with, endorsed by, or officially connected to any football club, league, platform, creator, or brand unless clearly stated.",
      "Club crests, logos, trademarks, and team names are the property of their respective owners and are used here for identification and informational purposes only.",
    ],
  },
  {
    title: "3. Public Creator Information",
    body: [
      "Fans First Reactions indexes publicly available information about football content creators to help supporters discover creators and communities.",
      "This may include public channel names, profile images, subscriber counts, public descriptions, supported clubs, leagues, handles, and links.",
      "If any information is inaccurate or requires updating, we encourage the creator or their authorised representative to contact us so we can review and update the listing where appropriate.",
    ],
  },
  {
    title: "4. Creator Profile Updates",
    body: [
      "If you are a creator listed on Fans First Reactions, you can request updates to your profile.",
      "This may include your creator name, biography, club, league, profile image, channel link, social links, or other public information displayed on your profile.",
    ],
  },
  {
    title: "5. Creator Removal Requests",
    body: [
      "If you are a creator or authorised representative and would like your profile removed from Fans First Reactions, contact us with enough information to verify the request.",
      "We will review genuine removal requests and take appropriate action where required.",
    ],
  },
  {
    title: "6. Copyright Complaints",
    body: [
      "If you believe material displayed on Fans First Reactions infringes your copyright, please contact us with clear details of the content, the page URL, your ownership or authority, and the action you are requesting.",
      "We will review copyright complaints and remove, update, or restrict content where appropriate.",
    ],
  },
  {
    title: "7. Trademark Concerns",
    body: [
      "Football club names, crests, logos, team names, competition names, and related branding belong to their respective owners.",
      "Fans First Reactions uses these references only to identify clubs, teams, leagues, creator categories, and football-related content.",
      "If you represent a rights holder and have a trademark concern, contact us with the relevant details and we will review the issue.",
    ],
  },
  {
    title: "8. Affiliate Partner Content",
    body: [
      "Some partner links on Fans First Reactions may be affiliate links. If you are a brand or rights holder and believe partner content is inaccurate or should be updated, contact us.",
      "Affiliate partnerships do not affect creator approvals, creator listings, or creator rankings.",
    ],
  },
  {
    title: "9. What to Include in a Request",
    body: [
      "When contacting us, please include the page URL, the creator or content involved, your name or organisation, your connection to the content, and a clear explanation of the requested change.",
      "For copyright or trademark complaints, please include enough information for us to understand and review the claim.",
    ],
  },
  {
    title: "10. Contact for Requests",
    body: [
      "For creator profile updates, creator removal requests, copyright complaints, trademark concerns, or incorrect information, contact fansfirstreactions@gmail.com.",
      "We aim to review genuine requests promptly and take appropriate action where necessary.",
    ],
  },
];

export default function CopyrightPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#67e1f9]">
            Legal
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Copyright & Creator Requests
          </h1>

          <p className="mt-5 text-lg text-gray-400">
            Last updated: 8 July 2026
          </p>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-300">
            This page explains how copyright, trademark, creator profile update,
            correction, and removal requests are handled by Fans First
            Reactions.
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
          <h2 className="text-3xl font-black">Send a Request</h2>
          <p className="mt-3 text-lg">
            For creator updates, removal requests, copyright issues, trademark
            concerns, or incorrect information, contact:
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