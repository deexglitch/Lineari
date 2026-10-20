import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { fullName, initials } from "@/lib/format";
import type { HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PersonRow({
  node,
  depth,
  forceOpen,
}: {
  node: HierarchyNode;
  depth: number;
  forceOpen: boolean;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const expanded = hasChildren && (open || forceOpen);
  const reports = node.direct_report_count;

  return (
    <li>
      <div className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-[#e0d6ec]/10">
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
            "grid size-7 shrink-0 place-items-center rounded-full text-[#e0d6ec] transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0d6ec]/60",
            hasChildren ? "hover:bg-[#e0d6ec]/15" : "opacity-0",
          )}
        >
          <CaretRight
            size={14}
            weight="bold"
            aria-hidden
            className={cn("transition-transform duration-200", expanded && "rotate-90")}
          />
        </button>

        <Avatar className="size-10 rounded-xl">
          <AvatarImage src={node.avatar_url} alt="" />
          <AvatarFallback className="rounded-xl bg-[#e0d6ec]/20 font-bold text-[#e0d6ec] ring-1 ring-[#e0d6ec]/25">
            {initials(node)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight">{fullName(node)}</p>
          <p className="truncate text-sm text-[#e0d6ec]/70">{node.role}</p>
        </div>

        {reports > 0 && (
          <span className="shrink-0 rounded-full bg-[#e0d6ec]/12 px-3 py-1 text-xs font-semibold tabular-nums text-[#e0d6ec] ring-1 ring-[#e0d6ec]/20">
            {reports} {reports === 1 ? "report" : "reports"}
          </span>
        )}
      </div>

      {expanded && (
        <ul className="ml-6 border-l border-[#e0d6ec]/20 pl-3">
          {node.children.map((child) => (
            <PersonRow key={child.id} node={child} depth={depth + 1} forceOpen={forceOpen} />
          ))}
        </ul>
      )}
    </li>
  );
}