export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildTelLink(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
