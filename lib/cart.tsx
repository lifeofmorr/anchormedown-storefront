"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getAllProducts, SHOP_DOMAIN } from "./catalog";

export interface CartLine {
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string;
  price: number;
  image: string | null;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (variantId: string, quantity?: number) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  checkoutUrl: string;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "amd-cart-v1";

function lineFor(variantId: string, quantity: number): CartLine | null {
  for (const p of getAllProducts()) {
    const v = p.variants.find((x) => x.id === variantId);
    if (v) {
      return {
        variantId,
        handle: p.handle,
        title: p.title,
        variantTitle: v.title,
        price: v.price,
        image: p.images[0]?.url ?? null,
        quantity,
      };
    }
  }
  return null;
}

/**
 * Cart state lives in the app; checkout is handed off to Shopify through the
 * cart permalink (https://anchormedown.com/cart/<variantId>:<qty>,...), which
 * lands the buyer in the real Shopify checkout with the exact same bag.
 * No fake checkout is built here, by design.
 */
export function buildCheckoutUrl(lines: CartLine[]): string {
  if (lines.length === 0) return `https://${SHOP_DOMAIN}/cart`;
  const parts = lines.map((l) => `${l.variantId}:${l.quantity}`).join(",");
  return `https://${SHOP_DOMAIN}/cart/${parts}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [isOpen, setOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* fresh bag */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (hydrated.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const add = useCallback((variantId: string, quantity = 1) => {
    setItems((prev) => ({
      ...prev,
      [variantId]: (prev[variantId] ?? 0) + quantity,
    }));
    setOpen(true);
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[variantId];
      return next;
    });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[variantId];
        return next;
      }
      return { ...prev, [variantId]: quantity };
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const lines = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => lineFor(id, qty))
        .filter((l): l is CartLine => Boolean(l)),
    [items]
  );
  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const checkoutUrl = useMemo(() => buildCheckoutUrl(lines), [lines]);

  const value: CartContextValue = {
    lines,
    count,
    subtotal,
    isOpen,
    setOpen,
    add,
    remove,
    setQuantity,
    clear,
    checkoutUrl,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
