import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { fullName, initials } from "@/lib/format";
import type { HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PersonRowTable({
  node,
  depth,
  forceOpen,
  highlightId,
}: {
  node: HierarchyNode;
  depth: number;
  forceOpen: boolean;
  highlightId?: string;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const expanded = hasChildren && (open || forceOpen);
  const reports = node.direct_report_count;
  const highlighted = node.id === highlightId;

  return (
    <li>
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={!hasChildren}
          aria-expanded={hasChildren ? expanded : undefined}
          aria-label={
            hasChildren
              ? `${expanded ? "Collapse" : "Expand"} ${fullName(node)}'s reports`
              : `${fullName(node)} has no reports`
          }
          className={cn(
            "mt-3 grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60",
            hasChildren ? "hover:bg-secondary hover:text-foreground" : "opacity-0",
          )}
        >
          <CaretRight
            size={14}
            weight="bold"
            aria-hidden
            className={cn("transition-transform duration-200", expanded && "rotate-90")}
          />
        </button>

        <div
          className={cn(
            "mt-1 w-full overflow-hidden rounded-2xl border",
            highlighted
              ? "border-primary/50 bg-primary/10 ring-1 ring-primary/40"
              : "border-border/60",
          )}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color-mix(in_srgb,var(--color-card),transparent_60%)] text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-3 py-1.5 text-left">Name</th>
                <th className="hidden px-3 py-1.5 text-left sm:table-cell">Role</th>
                <th className="hidden px-3 py-1.5 text-right sm:table-cell">Reports</th>
                <th className="w-14 px-3 py-1.5 text-right">Avatar</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border/60">
                <td className="px-3 py-2 text-left font-bold text-foreground">
                  {fullName(node)}
                </td>
                <td className="hidden px-3 py-2 text-left text-muted-foreground sm:table-cell">
                  {node.role}
                </td>
                <td className="hidden px-3 py-2 text-right tabular-nums text-muted-foreground sm:table-cell">
                  {reports}
                </td>
                <td className="px-3 py-2 text-right">
                  <Avatar className="ml-auto size-9 rounded-xl">
                    <AvatarImage src={node.avatar_url} alt="" />
                    <AvatarFallback className="rounded-xl bg-primary/15 font-bold text-foreground ring-1 ring-border">
                      {initials(node)}
                    </AvatarFallback>
                  </Avatar>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {expanded && (
        <ul className="ml-8 mt-2 space-y-2 border-l border-border/60 pl-3">
          {node.children.map((child) => (
            <PersonRowTable
              key={child.id}
              node={child}
              depth={depth + 1}
              forceOpen={forceOpen}
              highlightId={highlightId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}