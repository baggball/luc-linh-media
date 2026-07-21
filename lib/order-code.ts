const PREFIX = "LLM";

export function generateOrderCode(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `${PREFIX}${time}${random}`;
}

const ORDER_CODE_PATTERN = new RegExp(`${PREFIX}[A-Z0-9]{6,}`, "i");

export function extractOrderCode(text: string): string | null {
  const match = text.toUpperCase().match(ORDER_CODE_PATTERN);
  return match ? match[0] : null;
}
