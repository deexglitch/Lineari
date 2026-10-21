import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { Logo } from "@/components/atoms/logo";
import { authLinkClass } from "@/components/templates/auth-layout";
import "@/components/templates/auth.css";

const UPDATED = "20 October 2026";

const sections: { title: string; body: string[] }[] = [
  {
    title: "Using Lineari",
    body: [
      "Lineari is an employee hierarchy tool. It lets you create and manage employee records, set reporting lines and explore the organisation chart.",
      "By creating an account or signing in, you agree to these terms. If you do not agree, please do not use the service.",
    ],
  },
  {
    title: "Your account",
    body: [
      "You need an account to use Lineari. Give accurate details when you sign up and keep your password private. You are responsible for what happens under your account.",
      "Choose a password with at least 8 characters, including upper and lower case letters, a number and a symbol. Tell us straight away if you think someone else has access to your account.",
    ],
  },
  {
    title: "Employee data you add",
    body: [
      "You may only add information about people when you have the right to do so. Employee records can include a name, email address, date of birth, employee number, role and salary.",
      "You are responsible for keeping that information accurate and for handling it in line with the privacy laws that apply to you, such as POPIA in South Africa. Only enter what your organisation needs.",
    ],
  },
  {
    title: "How we handle your information",
    body: [
      "We store your name, email address and a hashed version of your password. We never store your password in plain text.",
      "We use two cookies to keep you signed in. They are marked HTTP-only so scripts on the page cannot read them. Signing out ends the session and clears both cookies.",
      "Avatars come from Gravatar. To load one, a hash of the employee's email address is sent to Gravatar's servers. Gravatar's own terms and privacy policy apply to that request.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Do not use Lineari to break the law, to access accounts or data that are not yours, or to disrupt the service. Do not try to bypass the security of the service or probe it for weaknesses without permission.",
    ],
  },
  {
    title: "Availability and changes",
    body: [
      "Lineari is provided as is. We try to keep it running and accurate, but we cannot promise it will always be available or free of errors. Please keep your own copies of anything important.",
      "We may change the service or these terms. When the terms change, the date at the top of this page changes with them. Using Lineari after a change means you accept the new terms.",
    ],
  },
  {
    title: "Ending your access",
    body: [
      "You can stop using Lineari at any time. We may suspend or close an account that breaks these terms.",
    ],
  },
  {
    title: "Contact",
    body: ["Questions about these terms can be sent to the team that runs your Lineari workspace."],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,#0b3b39_0%,#050f0e_60%)] px-4 py-10 text-[#d5e3df]">
      <main className="mx-auto w-full max-w-3xl">
        <article className="auth-glass rounded-[2rem] p-6 md:p-10" aria-labelledby="terms-title">
          <Logo variant="light" className="h-10" />
          <h1 id="terms-title" className="mt-6 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Terms of use
          </h1>
          <p className="mt-2 text-sm text-[#d5e3df]/70">Last updated {UPDATED}</p>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                <div className="mt-2 max-w-[68ch] space-y-3 leading-relaxed text-[#d5e3df]/90">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <p className="mt-5 text-center text-sm">
          <Link to="/signup" className={`${authLinkClass} inline-flex items-center gap-2`}>
            <ArrowLeft weight="bold" aria-hidden />
            Back to sign up
          </Link>
        </p>
      </main>
    </div>
  );
}