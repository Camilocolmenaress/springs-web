import type { CartItem } from "@/components/Cart";

export type { CartItem };

export type OrderInfo = {
  numero: number;
  items: CartItem[];
  total: number;
  zona: string;
  direccion: string;
  notas: string;
  nombre: string;
  celular: string;
  pago: string;
  createdAt: string;
};

const CART_KEY = "springs_cart";
const ORDER_KEY = "springs_last_order";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function getOrder(): OrderInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveOrder(order: OrderInfo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function calcTotal(items: CartItem[]): number {
  return items.reduce((s, i) => {
    const ext = i.extras.reduce((e, x) => e + x.precio * x.cantidad, 0);
    return s + (i.precio + ext) * i.cantidad;
  }, 0);
}

export function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
