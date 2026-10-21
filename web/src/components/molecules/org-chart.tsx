import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { initials } from "@/lib/format";
import type { HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { CustomNodeElementProps } from "react-d3-tree";

export function OrgChart({ nodeDatum }: CustomNodeElementProps) {
  const role = String(nodeDatum.attributes?.role ?? "No role");
  const avatarUrl = String(nodeDatum.attributes?.avatar_url ?? "");

  const nameParts = nodeDatum.name.split(" ");
  const fakeNode = {
    name: nameParts[0] ?? "",
    surname: nameParts.slice(1).join(" ") || "",
  } as HierarchyNode;

  return (
    <foreignObject x="-90" y="-55" width="180" height="110">
      <div
        {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center rounded-2xl border border-border bg-card px-3 py-2 text-foreground shadow-xl",
          "transition-colors hover:border-primary/50",
        )}
      >
        <Avatar className="size-10 rounded-full ring-2 ring-primary/20">
          <AvatarImage src={avatarUrl} alt="" />
          <AvatarFallback className="bg-primary/15 text-sm font-bold text-foreground">
            {initials(fakeNode)}
          </AvatarFallback>
        </Avatar>
        <p className="mt-1.5 w-full truncate text-center text-xs font-bold leading-tight">
          {nodeDatum.name}
        </p>
        <p className="w-full truncate text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          {role}
        </p>
      </div>
    </foreignObject>
  );
}