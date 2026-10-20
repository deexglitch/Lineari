export const fullName = (n: { name: string; surname: string }) => `${n.name} ${n.surname}`;
export const initials = (n: { name: string; surname: string }) =>
  `${n.name[0] ?? ""}${n.surname[0] ?? ""}`.toUpperCase();