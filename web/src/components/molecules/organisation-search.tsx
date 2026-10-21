import { MagnifyingGlass } from "@phosphor-icons/react";

export function OrganisationSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="glass-panel glass-panel--inset flex items-center gap-3 rounded-full px-5 py-3 text-foreground focus-within:ring-2 focus-within:ring-ring/50">
    <MagnifyingGlass size={20} weight="bold" aria-hidden className="text-muted-foreground" />
    <span className="sr-only">Search the organisation</span>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name or role"
      className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
    />
    </label>  
  );
}