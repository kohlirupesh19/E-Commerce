import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { requestJson } from '../lib/api';

export type CartItemView = {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  img?: string | null;
  outOfStock: boolean;
  slug?: string;
};

type CartContextValue = {
  items: CartItemView[];
  setItems: Dispatch<SetStateAction<CartItemView[]>>;
  refresh: () => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  itemCount: number;
  setItemCount: (count: number) => void;
  increment: (amount?: number) => void;
  reset: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemView[]>([]);
  const [itemCount, setItemCount] = useState(0);

  const normalizeItems = (response: any): CartItemView[] => {
    const rawItems = Array.isArray(response?.items) ? response.items : [];
    return rawItems.map((entry: any) => {
      const unitPrice = Number(entry?.unitPrice || 0);
      const product = entry?.product || {};
      const variant = entry?.variant
        ? [entry.variant.color, entry.variant.size].filter(Boolean).join(' / ')
        : undefined;
      return {
        id: String(product.id || entry.id),
        itemId: String(entry.id),
        name: product.name || 'Product',
        price: Number.isFinite(unitPrice) ? unitPrice : 0,
        quantity: Number(entry?.quantity || 1),
        variant,
        img: product.image || null,
        outOfStock: false,
        slug: product.slug,
      };
    });
  };

  const syncFromResponse = (response: any) => {
    const nextItems = normalizeItems(response);
    setItems(nextItems);
    const summaryCount = Number(response?.summary?.count ?? 0);
    setItemCount(Number.isFinite(summaryCount) && summaryCount >= 0
      ? summaryCount
      : nextItems.reduce((sum, item) => sum + item.quantity, 0));
  };

  const refresh = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setItems([]);
      setItemCount(0);
      return;
    }
    const response = await requestJson<any>('/api/cart', { method: 'GET' }, 'Unable to load cart.');
    syncFromResponse(response);
  };

  const updateItem = async (itemId: string, quantity: number) => {
    const response = await requestJson<any>(
      `/api/cart/items/${itemId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      },
      'Unable to update cart item.',
    );
    syncFromResponse(response);
  };

  const removeItem = async (itemId: string) => {
    const response = await requestJson<any>(
      `/api/cart/items/${itemId}`,
      { method: 'DELETE' },
      'Unable to remove cart item.',
    );
    syncFromResponse(response);
  };

  const clear = async () => {
    const response = await requestJson<any>('/api/cart/clear', { method: 'DELETE' }, 'Unable to clear cart.');
    syncFromResponse(response);
  };

  useEffect(() => {
    refresh().catch(() => {
      setItems([]);
      setItemCount(0);
    });
  }, []);

  const value = useMemo(
    () => ({
      items,
      setItems,
      refresh,
      updateItem,
      removeItem,
      clear,
      itemCount,
      setItemCount,
      increment: (amount = 1) => setItemCount((prev) => prev + amount),
      reset: () => {
        setItems([]);
        setItemCount(0);
      },
    }),
    [items, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
