export function formatIDR(amount: number, compact?: boolean): string {
  if (compact) {
    if (amount >= 1_000_000_000) {
      return `Rp ${(amount / 1_000_000_000).toFixed(1).replace(".", ",")}M`;
    }
    if (amount >= 1_000_000) {
      return `Rp ${(amount / 1_000_000).toFixed(1).replace(".", ",")}jt`;
    }
    if (amount >= 1_000) {
      return `Rp ${(amount / 1_000).toFixed(1).replace(".", ",")}rb`;
    }
  }

  const formatted = Math.abs(amount)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return amount < 0 ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

export function parseIDR(str: string): number {
  const cleaned = str.replace(/[Rp\s.]/g, "");
  const value = parseInt(cleaned, 10);
  return isNaN(value) ? 0 : value;
}

export function formatIDRInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
