/** Prénom : première lettre de chaque mot et de chaque partie après un tiret en majuscule, le reste en minuscule. */
export function formatFirstname(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  return trimmed
    .split(/\s+/)
    .map((word) =>
      word
        .split("-")
        .map((part) =>
          part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
        )
        .join("-"),
    )
    .join(" ");
}

/** Nom de famille : tout en majuscules. */
export function formatLastname(value: string): string {
  return value.trim().toUpperCase();
}
