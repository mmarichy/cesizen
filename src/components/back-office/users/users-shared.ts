export type AdminUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  isActive: boolean;
  createdAt: string;
};

export function formatPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "-";
  }

  const normalized = digits.startsWith("33")
    ? digits
    : digits.startsWith("0")
      ? `33${digits.slice(1)}`
      : digits;

  if (!/^33\d{9}$/.test(normalized)) {
    return phone;
  }

  return `+33 ${normalized.slice(2, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 7)} ${normalized.slice(7, 9)} ${normalized.slice(9, 11)}`;
}

export function roleBadgeClassName(role: string) {
  return role === "Admin"
    ? "border border-fuchsia-100 bg-fuchsia-50 text-fuchsia-600"
    : "border border-blue-100 bg-blue-50 text-blue-600";
}

export function statusBadgeClassName(isActive: boolean) {
  return isActive
    ? "border border-emerald-100 bg-emerald-500 text-white"
    : "border border-gray-200 bg-gray-100 text-gray-500";
}

export function toggleButtonClassName(isActive: boolean) {
  return isActive
    ? "bg-red-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.25)] hover:bg-red-600"
    : "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.25)] hover:bg-emerald-600";
}
