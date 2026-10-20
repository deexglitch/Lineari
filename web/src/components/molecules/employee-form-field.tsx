import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm font-semibold", className)}>
      {label}
      {children}
    </label>
  );
}