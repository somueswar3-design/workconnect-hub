import { API_BASE_URL as API_BASE, FREELANCER_API_BASE_URL as FREELANCER_API_BASE } from '@/config/api';

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
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
  role?: string;
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
  userId: number;
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

/**
 * Extract a human-readable error message from a failed Response. Handles the
 * common API shapes the backend returns: { error }, { message }, { title },
 * ASP.NET ProblemDetails { errors: { field: [msg] } }, or a raw string body.
 */
const extractErrorMessage = async (res: Response, fallback: string): Promise<string> => {
  const text = await res.text().catch(() => '');
  if (!text) return fallback;
  try {
    const data = JSON.parse(text);
    if (typeof data === 'string') return data;
    if (data?.error && typeof data.error === 'string') return data.error;
    if (data?.message && typeof data.message === 'string') return data.message;
    if (data?.detail && typeof data.detail === 'string') return data.detail;
    if (data?.title && typeof data.title === 'string') return data.title;
    if (data?.errors && typeof data.errors === 'object') {
      const flat = Object.values(data.errors).flat().filter(Boolean);
      if (flat.length) return flat.join(' ');
    }
    return fallback;
  } catch {
    return text || fallback;
  }
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

  sendOtp: async (email: string): Promise<{ status: number }> => {
    const res = await fetch(`${FREELANCER_API_BASE}/api/freelancer/send-otp?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send OTP');
    }
    return { status: res.status };
  },

  verifyOtp: async (email: string, otp: string): Promise<{ status: number }> => {
    const res = await fetch(`${FREELANCER_API_BASE}/api/freelancer/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid OTP');
    }
    return { status: res.status };
  },

  resendOtp: async (email: string): Promise<{ status: number }> => {
    const res = await fetch(`${FREELANCER_API_BASE}/api/freelancer/resend-otp?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to resend OTP');
    }
    return { status: res.status };
  },
};
