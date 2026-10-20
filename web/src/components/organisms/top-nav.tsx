import { forwardRef, type ComponentProps } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpenText,
  Moon,
  SquaresFour,
  Sun,
  TreeStructure,
  Users,
} from "@phosphor-icons/react";
import PillNav from "@/components/vendor/PillNav";
import LogoLight from "@/assets/logo-light.webp";
import LogoDark from "@/assets/logo-dark.webp";
import { SignOutButton } from "@/components/molecules/sign-out-button";
import { useTheme } from "@/hooks/useTheme";

const RouterLink = forwardRef<HTMLAnchorElement, ComponentProps<"a">>(
  function RouterLink({ href = "/", ...props }, ref) {
    return <Link ref={ref} to={href} {...props} />;
  },
);

const iconProps = { weight: "bold", "aria-hidden": true } as const;

const items = [
  { label: "Overview", href: "/", icon: <SquaresFour {...iconProps} /> },
  { label: "Organisation", href: "/organisation", icon: <TreeStructure {...iconProps} /> },
  { label: "Employees", href: "/employees", icon: <Users {...iconProps} /> },
  { label: "Guide", href: "/guide", icon: <BookOpenText {...iconProps} /> },
];

function activeHrefFor(pathname: string) {
  const match = items.find(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href),
  );
  return match?.href ?? "";
}

export function TopNav() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] py-3 pr-4 pl-0! shadow-md backdrop-blur-md md:pr-6">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <Link
          to="/"
          aria-label="Lineari home"
          className="pointer-events-auto mr-auto flex shrink-0 items-center gap-4 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <img src={dark ? LogoLight : LogoDark} alt="" className="h-11 w-auto object-contain" />
        </Link>

        <div className="pointer-events-auto flex min-w-0 flex-1 items-center justify-end gap-2">
          <PillNav
            items={items}
            activeHref={activeHrefFor(pathname)}
            linkComponent={RouterLink}
            ariaLabel="Primary"
            theme={dark ? "dark" : "light"}
            surface="glass"
            itemStyle="plain"
            hoverEffect="glide"
            indicator="pill"
            barColor={dark ? "rgba(213, 227, 223, 0.10)" : "rgba(255, 255, 255, 0.85)"}
            textColor={dark ? "#d5e3df" : "#2b1d3a"}
            highlightColor="#0b6e6a"
            highlightTextColor="#ffffff"
            className="data-collapsed:justify-end!"
          />
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground ring-1 ring-border transition-colors hover:bg-[color-mix(in_srgb,var(--color-secondary),var(--color-foreground)_6%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {dark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
          </button>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}