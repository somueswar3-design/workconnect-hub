const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7167';

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    email: string;
    role: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const authApi = {
  register: async (data: RegisterRequest): Promise<{ status: number }> => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    return { status: res.status };
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }
    const result = await res.json();
    return result;
  },

  googleLogin: async (data: GoogleLoginRequest): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/api/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Google login failed');
    }
    return await res.json();
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ status: number }> => {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send reset email');
    }
    return { status: res.status };
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ status: number }> => {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Password reset failed');
    }
    return { status: res.status };
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ status: number }> => {
    const res = await fetch(`${API_BASE}/api/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Password change failed');
    }
    return { status: res.status };
  },
};
