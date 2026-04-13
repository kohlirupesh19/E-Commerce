import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { orderApi, requestJson } from './api';

const createStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    clear: () => {
      store.clear();
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
};

describe('orderApi', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createStorage(),
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('sends bearer token on JSON requests', async () => {
    localStorage.setItem('accessToken', 'token-123');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ok: true }),
      json: async () => ({ ok: true }),
    } as Response);

    await requestJson('/api/orders/my', { method: 'GET' });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders/my'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      }),
    );
  });

  it('calls create and verify lifecycle endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ status: 'ok' }),
      json: async () => ({ status: 'ok' }),
    } as Response);

    await orderApi.create({ addressId: 'addr-1', paymentMethod: 'UPI' });
    await orderApi.verifyPayment({
      orderId: 'order-1',
      razorpayOrderId: 'rzp_order_1',
      razorpayPaymentId: 'rzp_pay_1',
      razorpaySignature: 'sig_1',
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/api/orders/create'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/api/orders/verify-payment'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('calls cancel, reorder and invoice endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ status: 'ok' }),
      json: async () => ({ status: 'ok' }),
      blob: async () => new Blob(['pdf']),
    } as Response);

    await orderApi.cancel('order-2');
    await orderApi.reorder('order-2');
    await orderApi.invoice('order-2');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/api/orders/order-2/cancel'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/api/orders/order-2/reorder'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('/api/orders/order-2/invoice'),
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
