import { Link } from "react-router-dom";
import {
  BookOpenText,
  ArrowRight,
  Users,
  TreeStructure,
  UserCircle,
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  Sun,
  SignOut,
  ShieldCheck,
} from "@phosphor-icons/react";
import { buttonVariants } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

type Section = {
  id: string;
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
};

const steps: Section[] = [
  {
    id: "overview",
    icon: <BookOpenText size={18} weight="bold" aria-hidden />,
    title: "What Lineari is",
    body: (
      <>
        <p>
          Lineari is a small workspace for managing your organisation&apos;s reporting
          lines. You add employees, set who reports to whom, and explore the org chart
          visually. Two roles exist: <strong>Administrator</strong> (can create, edit
          and delete employees) and <strong>Viewer</strong> (browse only).
        </p>
        <p>
          Every new account starts as a Viewer. An administrator promotes people when
          they need write access.
        </p>
      </>
    ),
  },
  {
    id: "signin",
    icon: <UserCircle size={18} weight="bold" aria-hidden />,
    title: "Signing in and your account",
    body: (
      <>
        <p>
          Sessions last 7 days. After 15 minutes of inactivity the app refreshes the
          session quietly in the background; you only need to sign in again if you
          haven&apos;t used it for a week.
        </p>
        <p>
          From <strong>Account</strong> (top-right on the Overview page) you can change
          your first name, last name, email, and password. Changing your password ends
          every other signed-in session but keeps your current one working.
        </p>
      </>
    ),
  },
  {
    id: "overview-page",
    icon: <Users size={18} weight="bold" aria-hidden />,
    title: "The Overview page",
    body: (
      <>
        <p>The home page shows:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Your name, email, and role.</li>
          <li>
            <strong>Reporting line</strong> — who you report to, plus everyone above
            you.
          </li>
          <li>
            <strong>Your team</strong> — people who report directly to you.
          </li>
          <li>
            <strong>Workspace stats</strong> — headcount, top-level employees, and
            manager-report pairs.
          </li>
        </ul>
        <p>
          The three buttons beside your name jump to <strong>Organisation</strong>,{" "}
          <strong>Employees</strong>, and <strong>Account</strong>.
        </p>
      </>
    ),
  },
  {
    id: "adding",
    icon: <Plus size={18} weight="bold" aria-hidden />,
    title: "Adding an employee (admins)",
    body: (
      <>
        <p>
          Open <strong>Employees</strong> and click <strong>Add employee</strong> in the
          top-right. Fill in:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>First name and surname.</li>
          <li>Email — used for their Gravatar avatar.</li>
          <li>Employee number — unique across the org.</li>
          <li>Role or position.</li>
          <li>Date of birth — must be in the past.</li>
          <li>Salary — zero or more.</li>
          <li>
            Who they report to — pick anyone in the directory, or leave it as{" "}
            <em>No manager</em>.
          </li>
        </ul>
        <p>
          Click <strong>Add employee</strong>. The new person appears in the directory
          and the org chart immediately.
        </p>
      </>
    ),
  },
  {
    id: "editing",
    icon: <PencilSimple size={18} weight="bold" aria-hidden />,
    title: "Editing an employee (admins)",
    body: (
      <>
        <p>
          In <strong>Employees</strong>, click the pencil icon on someone&apos;s row.
          Every field is pre-filled; change what you need and click{" "}
          <strong>Save changes</strong>.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Changing their manager moves them in the org chart.</li>
          <li>
            You can&apos;t set someone as their own manager, and you can&apos;t create a
            loop (A reports to B while B reports to A). The app rejects both.
          </li>
          <li>
            Changing their email or employee number to one already in use shows a
            friendly error; nothing is lost.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "deleting",
    icon: <Trash size={18} weight="bold" aria-hidden />,
    title: "Deleting an employee (admins)",
    body: (
      <>
        <p>
          Click the trash icon on someone&apos;s row. If they have no reports, confirm
          and delete. If they do, choose what happens to their reports:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Leave them with no manager</strong> — they become top-level.
          </li>
          <li>
            <strong>Move them to another manager</strong> — the dropdown only offers
            people who don&apos;t sit underneath the employee being deleted, so no loop
            can be created.
          </li>
        </ul>
        <p>Deleting cannot be undone.</p>
      </>
    ),
  },
  {
    id: "directory",
    icon: <MagnifyingGlass size={18} weight="bold" aria-hidden />,
    title: "Browsing the directory",
    body: (
      <>
        <p>The Employees page lets everyone:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Search by name, role, email, or employee number.</li>
          <li>
            Sort by clicking a column header (Name, Role, Manager, Email); click again
            to reverse.
          </li>
          <li>
            Jump to the org chart for a person with the tree icon on their row.
          </li>
        </ul>
        <p>
          The count above the table shows how many match your search out of the total.
        </p>
      </>
    ),
  },
  {
    id: "organisation",
    icon: <TreeStructure size={18} weight="bold" aria-hidden />,
    title: "Exploring the organisation",
    body: (
      <>
        <p>
          Open <strong>Organisation</strong> from the top nav. Two view modes are
          available (your choice is remembered on this browser):
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>List</strong> — indented tree. Click the caret next to a manager to
            expand or collapse their reports.
          </li>
          <li>
            <strong>Graph</strong> — visual org chart. Drag to pan, scroll to zoom,
            click the caret to fold a branch.
          </li>
        </ul>
        <p>
          Both views support the same search. Type a name or role and the tree prunes
          to that person and their chain above them.
        </p>
      </>
    ),
  },
  {
    id: "theme",
    icon: <Sun size={18} weight="bold" aria-hidden />,
    title: "Changing the theme",
    body: (
      <p>
        Click the sun/moon button in the top-right of the nav bar. The app switches
        instantly between dark and light, and remembers your choice on this browser.
      </p>
    ),
  },
  {
    id: "signout",
    icon: <SignOut size={18} weight="bold" aria-hidden />,
    title: "Signing out",
    body: (
      <p>
        Click <strong>Sign out</strong> in the top-right. You land back on the login
        page and your session cookies are cleared. On a shared computer, always sign
        out — otherwise the browser keeps the session alive for up to 7 days.
      </p>
    ),
  },
];

const roles = [
  {
    name: "Administrator",
    can: [
      "Browse the directory and org chart",
      "Add employees",
      "Edit existing employees (including managers)",
      "Delete employees and reassign their reports",
    ],
    cannot: ["Nothing employee-related is off-limits"],
  },
  {
    name: "Viewer",
    can: ["Browse the directory and org chart", "Search, sort, and jump to a person"],
    cannot: ["Add, edit, or delete employees"],
  },
];

const tips = [
  {
    title: "You can't set someone as their own manager.",
    body: "Lineari rejects it at the database level, not just in the form.",
  },
  {
    title: "You can't create a circular reporting line.",
    body: "Before any write that changes a manager, the app walks the chain to make sure it wouldn't loop.",
  },
  {
    title: "A manager with reports can't be deleted without a plan.",
    body: "The delete dialog makes you either reassign their reports or set them free.",
  },
  {
    title: "Gravatar decides your avatar.",
    body: "The image comes from the email address you signed up with — Gravatar serves a default if none exists.",
  },
];

function AnchorLink({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      className="block truncate rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {label}
    </a>
  );
}

export default function GuidePage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="glass-panel rounded-[2rem] text-foreground">
        <div className="p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Guide
          </p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            How to use Lineari.
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            A short reference for signing in, managing employees, and finding your way
            around the organisation. Everything below works the same for administrators
            and viewers unless it says otherwise.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/employees"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
              )}
            >
              <Users weight="bold" aria-hidden />
              Employees
            </Link>
            <Link
              to="/organisation"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-secondary font-bold text-foreground ring-1 ring-border hover:bg-[color-mix(in_srgb,var(--color-secondary),var(--color-foreground)_8%)]",
              )}
            >
              <TreeStructure weight="bold" aria-hidden />
              Organisation
            </Link>
            <Link
              to="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-secondary font-bold text-foreground ring-1 ring-border hover:bg-[color-mix(in_srgb,var(--color-secondary),var(--color-foreground)_8%)]",
              )}
            >
              Overview
              <ArrowRight weight="bold" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Two-column: TOC + content */}
      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        {/* Table of contents */}
        <aside className="hidden lg:block">
          <nav
            aria-label="Guide contents"
            className="glass-panel sticky top-24 rounded-[1.5rem] p-4 text-foreground"
          >
            <p className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-1">
              {steps.map((s) => (
                <li key={s.id}>
                  <AnchorLink id={s.id} label={s.title} />
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Body */}
        <div className="space-y-4">
          {/* Steps */}
          <section className="glass-panel rounded-[2rem] text-foreground">
            <div className="divide-y divide-border/60">
              {steps.map((s) => (
                <article
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-24 p-6 md:p-8"
                >
                  <header className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
                      {s.icon}
                    </span>
                    <h2 className="text-xl font-extrabold tracking-tight text-foreground md:text-2xl">
                      {s.title}
                    </h2>
                  </header>
                  <div className="mt-4 max-w-[68ch] space-y-3 text-sm leading-relaxed text-foreground/85 md:text-base">
                    {s.body}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Roles */}
          <section id="roles" className="glass-panel rounded-[2rem] text-foreground">
            <div className="p-6 md:p-8">
              <header className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
                  <ShieldCheck size={18} weight="bold" aria-hidden />
                </span>
                <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">
                  Who can do what
                </h2>
              </header>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {roles.map((r) => (
                  <div
                    key={r.name}
                    className="rounded-2xl border border-border bg-[color-mix(in_srgb,var(--color-card),transparent_20%)] p-5"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {r.name}
                    </p>
                    <p className="mt-2 text-sm text-foreground/85">Can:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-foreground/85">
                      {r.can.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-foreground/85">Cannot:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {r.cannot.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tips */}
          <section id="tips" className="glass-panel rounded-[2rem] text-foreground">
            <div className="p-6 md:p-8">
              <header className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
                  <BookOpenText size={18} weight="bold" aria-hidden />
                </span>
                <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">
                  Good to know
                </h2>
              </header>

              <ul className="mt-6 space-y-4">
                {tips.map((t) => (
                  <li
                    key={t.title}
                    className="rounded-2xl border border-border/60 bg-[color-mix(in_srgb,var(--color-card),transparent_30%)] p-4"
                  >
                    <p className="font-bold text-foreground">{t.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="glass-panel rounded-[2rem] text-foreground">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
              <p className="text-sm text-muted-foreground">
                Stuck somewhere? Everything here is also reachable from the top nav —
                nothing is hidden behind a menu.
              </p>
              <Link
                to="/"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "shrink-0 rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
                )}
              >
                Back to Overview
                <ArrowRight weight="bold" aria-hidden />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}