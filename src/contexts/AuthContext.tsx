import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AuthUser = {
  id?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (token: string | null, user?: AuthUser | null) => void;
  clearAuth: () => void;
};

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'authUser';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const safeParseUser = (value: string | null): AuthUser | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
};

const decodeJwtRole = (token: string | null): string | undefined => {
  if (!token) return undefined;
  const parts = token.split('.');
  if (parts.length < 2) return undefined;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload?.role || payload?.roles?.[0] || payload?.authorities?.[0] || undefined;
  } catch {
    return undefined;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(safeParseUser(localStorage.getItem(USER_KEY)));

  const setAuth = (nextToken: string | null, nextUser: AuthUser | null = null) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
      setToken(nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    } else if (!nextToken) {
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => {
    const role = user?.role || decodeJwtRole(token);
    const normalized = role?.toUpperCase();
    return {
      token,
      user,
      isAuthenticated: !!token,
      isAdmin: normalized === 'ADMIN' || normalized === 'ROLE_ADMIN',
      setAuth,
      clearAuth,
    };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
