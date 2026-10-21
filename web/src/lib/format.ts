type Named = { name?: string; surname?: string };

export const fullName = (n: Named) => `${n.name ?? ""} ${n.surname ?? ""}`.trim();
export const initials = (n: Named) =>
  `${n.name?.[0] ?? ""}${n.surname?.[0] ?? ""}`.toUpperCase();