// Client-side cart state (localStorage). Framework-free to keep JS small (rule 8).
// Checkout is delegated to a provider (src/lib/commerce/checkout.ts) so Shopify can be plugged in later.

export interface CartLine {
  handle: string;
  name: string;
  price: number;
  image: string;
  url: string;
  quantity: number;
}

const KEY = 'flavory-cart-v1';
const EVENT = 'flavory:cart';
export const MAX_QTY = 20;

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Storage full or blocked: the cart still works for this page view.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: lines }));
}

export const cart = {
  lines: read,
  count: () => read().reduce((n, l) => n + l.quantity, 0),
  subtotal: () => read().reduce((sum, l) => sum + l.price * l.quantity, 0),
  add(line: Omit<CartLine, 'quantity'>, quantity = 1) {
    const lines = read();
    const existing = lines.find((l) => l.handle === line.handle);
    if (existing) existing.quantity = Math.min(MAX_QTY, existing.quantity + quantity);
    else lines.push({ ...line, quantity: Math.min(MAX_QTY, quantity) });
    write(lines);
  },
  setQuantity(handle: string, quantity: number) {
    const lines = read()
      .map((l) => (l.handle === handle ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l))
      .filter((l) => l.quantity > 0);
    write(lines);
  },
  clear: () => write([]),
  subscribe(fn: (lines: CartLine[]) => void) {
    const handler = () => fn(read());
    window.addEventListener(EVENT, handler);
    // Keep multiple tabs in sync.
    window.addEventListener('storage', (e) => e.key === KEY && handler());
    return () => window.removeEventListener(EVENT, handler);
  },
};
