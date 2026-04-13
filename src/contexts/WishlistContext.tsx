import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { requestJson } from '../lib/api';

export type WishlistItemView = {
  id: string;
  name: string;
  price: number;
  img?: string | null;
  slug?: string;
  inStock: boolean;
};

type WishlistContextValue = {
  items: WishlistItemView[];
  setItems: Dispatch<SetStateAction<WishlistItemView[]>>;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const normalizeItems = (raw: any): WishlistItemView[] => {
  const source = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
  return source.map((entry: any) => {
    const product = entry?.product || {};
    const price = Number(product.discountPrice ?? product.price ?? 0);
    return {
      id: String(product.id || entry.id),
      name: product.name || 'Product',
      price: Number.isFinite(price) ? price : 0,
      img: product.image || null,
      slug: product.slug,
      inStock: Boolean(product.isAvailable ?? true),
    };
  });
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItemView[]>([]);

  const refresh = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setItems([]);
      return;
    }
    const response = await requestJson<any[]>('/api/wishlist', { method: 'GET' }, 'Unable to load wishlist.');
    setItems(normalizeItems(response));
  };

  const toggle = async (productId: string) => {
    const response = await requestJson<any>(
      '/api/wishlist/toggle',
      {
        method: 'POST',
        body: JSON.stringify({ productId }),
      },
      'Unable to update wishlist.',
    );
    setItems(normalizeItems(response));
  };

  useEffect(() => {
    refresh().catch(() => setItems([]));
  }, []);

  const value = useMemo(
    () => ({
      items,
      setItems,
      refresh,
      toggle,
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }
  return context;
}
