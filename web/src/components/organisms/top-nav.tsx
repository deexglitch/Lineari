import { forwardRef, type ComponentProps } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpenText,
  SquaresFour,
  TreeStructure,
  Users,
} from "@phosphor-icons/react";
import PillNav from "@/components/vendor/PillNav";
import  LogoLight  from "@/assets/logo-light.webp"
import { SignOutButton } from "@/components/molecules/sign-out-button";

/**
 * PillNav renders its links as <LinkComponent href=... />.
 * React Router wants `to`, so this adapter translates. It lives at module
 * level so its identity is stable between renders (PillNav's animation
 * engine measures the DOM, and remounting links would reset it).
 */
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
  // An empty string keeps PillNav in controlled mode with nothing selected,
  // instead of falling back to its own click tracking on unknown routes.
  return match?.href ?? "";
}

export function TopNav() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-plum pl-0! pr-4 md:pr-6 py-3 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <Link
          to="/"
          aria-label="Lineari home"
          className="mr-auto pointer-events-auto flex shrink-0 items-center gap-4 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          <img src={LogoLight} alt="" className="h-11 w-auto object-contain" />
          
        </Link>

        {/* PillNav measures its parent's width to decide when to fold into a menu,
            so it gets its own flexible wrapper rather than sharing a row with the brand. */}
        <div className="pointer-events-auto flex min-w-0 flex-1 justify-end">
          <PillNav
            items={items}
            activeHref={activeHrefFor(pathname)}
            linkComponent={RouterLink}
            ariaLabel="Primary"
            theme="light"
            surface="glass"
            itemStyle="plain"
            hoverEffect="glide"
            indicator="pill"
            barColor="rgba(255, 255, 255, 0.85)"
            textColor="#2b1d3a"
            highlightColor="#0b6e6a"
            highlightTextColor="#ffffff"
            // PillNav's own CSS is unlayered, so Tailwind needs `!` to win here.
            className="data-collapsed:justify-end!"
          />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}