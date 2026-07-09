import Link from "next/link";

export const metadata = {
  title: "Contact | Fans First Reactions",
  description:
    "Contact Fans First Reactions for creator profile updates, removal requests, copyright concerns, privacy requests, and general enquiries.",
};

const contactOptions = [
  {
    title: "Creator Profile Updates",
    text: "Request corrections to your creator name, club, league, channel link, description, avatar, or other public profile information.",
  },
  {
    title: "Creator Removal Requests",
    text: "If you own or represent a listed creator profile and would like it removed, contact us with the relevant profile URL and verification details.",
  },
  {
    title: "Copyright or Trademark Concerns",
    text: "Report copyright, trademark, club branding, creator branding, or other intellectual property concerns.",
  },
  {
    title: "Privacy & Data Requests",
    text: "Contact us about account deletion, data access, corrections, UK GDPR rights, or privacy questions.",
  },
  {
    title: "General Enquiries",
    text: "Send questions, feedback, feature requests, partnership enquiries, or creator guide suggestions.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#67e1f9]">
            Contact
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Contact Fans First Reactions
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-300">
            Contact us about creator profile updates, removal requests,
            copyright concerns, trademark issues, privacy requests, affiliate
            enquiries, or general feedback.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 md:px-12">
        <div className="rounded-[28px] bg-[#67e1f9] p-8 text-black">
          <h2 className="text-3xl font-black">Email</h2>
          <p className="mt-3 text-lg">
            The main contact email for Fans First Reactions is:
          </p>
          <p className="mt-4 break-words text-2xl font-black">
            fansfirstreactions@gmail.com
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {contactOptions.map((option) => (
            <div
              key={option.title}
              className="rounded-[28px] border border-[#67e1f9]/25 bg-[#0c1020] p-7"
            >
              <h2 className="text-2xl font-black text-white">
                {option.title}
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-gray-400">
                {option.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] border border-white/10 bg-[#0c1020] p-8">
          <h2 className="text-3xl font-black">What to Include</h2>

          <div className="mt-5 space-y-4 text-lg leading-relaxed text-gray-400">
            <p>
              To help us review your request quickly, please include the
              relevant page URL, creator name, YouTube channel link, your
              relationship to the creator or rights holder, and a clear
              explanation of what you would like changed.
            </p>

            <p>
              For copyright or trademark concerns, please include enough detail
              for us to identify the content and understand the issue.
            </p>

            <p>
              Fans First Reactions indexes publicly available information about
              football creators to help supporters discover creators and
              communities. We review genuine update, correction, and removal
              requests where appropriate.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-[#67e1f9] px-7 py-4 font-black text-black hover:bg-white"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}