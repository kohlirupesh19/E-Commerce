import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { requestJson } from '../lib/api';

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categorySlug: string;
  priceValue: number;
  price: string;
  img: string;
};

type CatalogContextValue = {
  products: CatalogProduct[];
  byCategory: (slug: string) => CatalogProduct[];
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

const toPriceLabel = (value: number) => `$${value.toFixed(2)}`;

const mapProducts = (raw: any): CatalogProduct[] => {
  const source = Array.isArray(raw?.items) ? raw.items : [];
  return source.map((entry: any) => {
    const priceValue = Number(entry?.effectivePrice ?? entry?.discountPrice ?? entry?.price ?? 0);
    return {
      id: String(entry?.id),
      name: entry?.name || 'Product',
      slug: entry?.slug || '',
      brand: entry?.brand || 'Obsidian Curator',
      categorySlug: entry?.category?.slug || 'uncategorized',
      priceValue: Number.isFinite(priceValue) ? priceValue : 0,
      price: toPriceLabel(Number.isFinite(priceValue) ? priceValue : 0),
      img: entry?.primaryImage || '/images/placeholder-product.png',
    };
  });
};

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  const refresh = async () => {
    const response = await requestJson<any>(
      '/api/products?available=true&page=1&limit=100',
      { method: 'GET' },
      'Unable to load catalog.',
    );
    setProducts(mapProducts(response));
  };

  useEffect(() => {
    refresh().catch(() => setProducts([]));
  }, []);

  const value = useMemo(
    () => ({
      products,
      byCategory: (slug: string) => products.filter((item) => item.categorySlug === slug),
      refresh,
    }),
    [products],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used inside CatalogProvider');
  }
  return context;
}
