import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  email: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  userId?: string;
  profilePercentage?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True once the provider has finished restoring auth from localStorage. */
  ready: boolean;
  login: (token: string, user?: Partial<AuthUser>) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode JWT payload without library
const decodeJwt = (token: string): Record<string, any> | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const USERID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

// Read auth from localStorage SYNCHRONOUSLY so the very first render already
// has the correct authenticated state. Doing this in useEffect causes a brief
// render where isAuthenticated=false, which makes ProtectedRoute redirect to
// /login on every page refresh.
const readInitialAuth = (): { token: string | null; user: AuthUser | null } => {
  try {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      return { token: savedToken, user: JSON.parse(savedUser) as AuthUser };
    }
  } catch {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
  return { token: null, user: null };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initial = readInitialAuth();
  const [user, setUser] = useState<AuthUser | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);
  // Auth is ready immediately because we hydrate synchronously above.
  const [ready] = useState(true);


  const login = (newToken: string, userOverrides?: Partial<AuthUser>) => {
    const claims = decodeJwt(newToken);
    const role = claims?.[ROLE_CLAIM] || userOverrides?.role || 'FreeLancer';
    const userId = claims?.[USERID_CLAIM] || userOverrides?.userId || '';
    // Prefer the `name` claim from the token (full name set at registration),
    // then any explicit override, then common fallback claims.
    const nameFromToken =
      claims?.[NAME_CLAIM] ||
      claims?.name ||
      claims?.unique_name ||
      claims?.given_name ||
      '';

    const newUser: AuthUser = {
      email: userOverrides?.email || claims?.email || '',
      role: String(role),
      fullName: userOverrides?.fullName || (nameFromToken ? String(nameFromToken) : undefined),
      avatarUrl: userOverrides?.avatarUrl,
      userId,
      profilePercentage: userOverrides?.profilePercentage,
    };

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
