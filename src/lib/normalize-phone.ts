export function normalizeFrenchPhone(phone?: string) {
  const trimmed = phone?.trim();

  if (!trimmed) {
    return null;
  }

  const compact = trimmed.replace(/\s+/g, "");

  if (compact.startsWith("+33")) {
    return compact;
  }

  if (compact.startsWith("33")) {
    return `+${compact}`;
  }

  if (/^\d/.test(compact)) {
    return `+33${compact.slice(1)}`;
  }

  return compact;
}

export function isValidFrenchPhone(phone: string | null) {
  if (!phone) {
    return true;
  }

  return /^\+33[1-9]\d{8}$/.test(phone);
}
