const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7167';

export interface RegisterRequest {
  mobile?: string;
  email?: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export const registerUser = async (data: RegisterRequest): Promise<{ status: number }> => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return { status: res.status };
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<{ status: number }> => {
  const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('OTP verification failed');
  return { status: res.status };
};
