export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL?.trim() || 'http://localhost:8080';

const getStoredToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const parsePayload = (text: string) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const getApiErrorMessage = (payload: any, fallback: string) => {
  if (!payload) return fallback;
  if (typeof payload.error === 'string' && payload.error.trim()) return payload.error;
  if (typeof payload.message === 'string' && payload.message.trim()) return payload.message;
  if (payload.errors && typeof payload.errors === 'object') {
    const firstValidationError = Object.values(payload.errors).find(
      (value) => typeof value === 'string' && value.trim(),
    ) as string | undefined;
    if (firstValidationError) return firstValidationError;
  }
  return fallback;
};

export const requestJson = async <T,>(
  path: string,
  init?: RequestInit,
  fallbackError = 'Request failed. Please try again.',
): Promise<T> => {
  const token = getStoredToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new Error('Unable to reach the API server. Please make sure backend is running and CORS is configured for this origin.');
  }

  const text = await response.text();
  const payload = parsePayload(text);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, fallbackError));
  }

  return payload as T;
};

export const requestFormData = async <T,>(
  path: string,
  method: string,
  formData: FormData,
  fallbackError = 'Upload failed. Please try again.',
): Promise<T> => {
  const token = getStoredToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...authHeader,
      },
      body: formData,
    });
  } catch {
    throw new Error('Unable to reach the API server. Please make sure backend is running and CORS is configured for this origin.');
  }

  const text = await response.text();
  const payload = parsePayload(text);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, fallbackError));
  }

  return payload as T;
};

export const authApi = {
  login: (body: { email: string; password: string; rememberMe: boolean }) =>
    requestJson<{ accessToken?: string; user?: any }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      'Unable to sign in right now.',
    ),
  googleLogin: (credential: string) =>
    requestJson<{ accessToken?: string; user?: any }>(
      '/api/auth/google',
      {
        method: 'POST',
        body: JSON.stringify({ credential }),
      },
      'Unable to sign in with Google right now.',
    ),
  register: (body: {
    name: string;
    email: string;
    phone?: string | null;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  }) =>
    requestJson<{ message?: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  forgotPassword: (email: string) =>
    requestJson<{ message?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  verifyForgotOtp: (email: string, otp: string) =>
    requestJson<{ resetToken: string }>('/api/auth/verify-forgot-password-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),
  resetPassword: (body: { resetToken: string; newPassword: string; confirmPassword: string }) =>
    requestJson<{ message?: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  me: () => requestJson<any>('/api/auth/me', { method: 'GET' }),
  updateMe: (body: {
    name?: string;
    phone?: string;
    dob?: string;
    gender?: string;
    avatar?: string;
    orderUpdates?: boolean;
    newCollections?: boolean;
    securityAlerts?: boolean;
    newsletter?: boolean;
  }) =>
    requestJson<any>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  changePassword: (body: any) =>
    requestJson<any>('/api/auth/me/change-password', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  toggle2fa: (enabled: boolean) =>
    requestJson<any>('/api/auth/me/2fa', {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return requestFormData<any>('/api/auth/me/avatar', 'POST', formData);
  },
  verifyOtp: (body: { email: string; otp: string; type: string }) =>
    requestJson<{ accessToken?: string; user?: any }>(
      '/api/auth/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      'Verification failed.',
    ),
  resendOtp: (email: string, type: string) =>
    requestJson<{ message?: string }>('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, type }),
    }),
};

export const orderApi = {
  create: (body: { addressId: string; paymentMethod: string; couponCode?: string }) =>
    requestJson<any>('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  verifyPayment: (body: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    requestJson<any>('/api/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  myOrders: (status?: string) =>
    requestJson<any[]>(`/api/orders/me${status ? `?status=${status}` : ''}`, { method: 'GET' }),
  byId: (orderId: string) => requestJson<any>(`/api/orders/${orderId}`, { method: 'GET' }),
  cancel: (orderId: string) => requestJson<any>(`/api/orders/${orderId}/cancel`, { method: 'POST' }),
  reorder: (orderId: string) => requestJson<any>(`/api/orders/${orderId}/reorder`, { method: 'POST' }),
  invoice: async (orderId: string): Promise<Blob> => {
    const token = getStoredToken();
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/invoice`, {
      method: 'GET',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!response.ok) {
      throw new Error('Unable to download invoice.');
    }
    return response.blob();
  },
};

export const addressApi = {
  getAll: () => requestJson<any[]>('/api/addresses', { method: 'GET' }),
  create: (body: any) =>
    requestJson<any>('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: string, body: any) =>
    requestJson<any>(`/api/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: (id: string) =>
    requestJson<{ message: string }>(`/api/addresses/${id}`, { method: 'DELETE' }),
};

export const productApi = {
  getAll: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    return requestJson<any>(`/api/products${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getFeatured: () => requestJson<any[]>('/api/products/featured', { method: 'GET' }),
  getNewArrivals: () => requestJson<any[]>('/api/products/new-arrivals', { method: 'GET' }),
  getBySlug: (slug: string) => requestJson<any>(`/api/products/${slug}`, { method: 'GET' })
};

export const categoryApi = {
  getAll: () => requestJson<any[]>('/api/categories', { method: 'GET' }),
  getBySlug: (slug: string) => requestJson<any>(`/api/categories/${slug}`, { method: 'GET' })
};

export const cartApi = {
  get: () => requestJson<any>('/api/cart', { method: 'GET' }),
  addItem: (body: { productId: string; variantId?: string; quantity: number }) => 
    requestJson<any>('/api/cart/items', { method: 'POST', body: JSON.stringify(body) }),
  removeItem: (itemId: string) => 
    requestJson<any>(`/api/cart/items/${itemId}`, { method: 'DELETE' }),
  clear: () => 
    requestJson<any>('/api/cart/clear', { method: 'DELETE' })
};

export const wishlistApi = {
  toggle: (productId: string) => 
    requestJson<any>('/api/wishlist/toggle', { method: 'POST', body: JSON.stringify({ productId }) })
};

export const notificationApi = {
  getAll: () => requestJson<any[]>('/api/notifications', { method: 'GET' }),
  markAsRead: (id: string) => requestJson<any>(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  unreadCount: () => requestJson<number>('/api/notifications/unread-count', { method: 'GET' }),
};

export const paymentMethodApi = {
  getAll: () => requestJson<any[]>('/api/payments', { method: 'GET' }),
  create: (body: any) => requestJson<any>('/api/payments', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id: string) => requestJson<any>(`/api/payments/${id}`, { method: 'DELETE' }),
};

export const adminApi = {
  createCategory: (body: any) => requestJson<any>('/api/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: string, body: any) => requestJson<any>(`/api/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id: string) => requestJson<any>(`/api/admin/categories/${id}`, { method: 'DELETE' }),

  createProduct: (body: any) => requestJson<any>('/api/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: any) => requestJson<any>(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: string) => requestJson<any>(`/api/admin/products/${id}`, { method: 'DELETE' })
};
