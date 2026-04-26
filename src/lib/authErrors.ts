/**
 * Normalises raw API error messages into a user-friendly { title, description }
 * pair. Detects common cases (duplicate email, invalid credentials, network)
 * so the UI can render a clean inline alert instead of a raw server string.
 */
export type FriendlyAuthError = {
  title: string;
  description: string;
  /** Suggested next action shown as a small link in the alert. */
  action?: { label: string; to: string };
};

const lower = (s?: string) => (s || '').toLowerCase();

export const toFriendlyAuthError = (
  raw: unknown,
  context: 'login' | 'register' | 'google',
): FriendlyAuthError => {
  const msg = raw instanceof Error ? raw.message : typeof raw === 'string' ? raw : '';
  const m = lower(msg);

  // Duplicate / already-registered email
  if (
    m.includes('already') ||
    m.includes('exists') ||
    m.includes('duplicate') ||
    m.includes('registered') ||
    m.includes('taken')
  ) {
    return {
      title: 'This email is already registered',
      description:
        context === 'google'
          ? 'An account with this Google email already exists. Please sign in instead.'
          : 'An account with this email already exists. Try signing in or reset your password.',
      action: { label: 'Go to sign in', to: '/login' },
    };
  }

  // Invalid credentials
  if (m.includes('invalid') && (m.includes('credential') || m.includes('password') || m.includes('email'))) {
    return {
      title: 'Invalid email or password',
      description: 'Please double-check your credentials and try again.',
      action: { label: 'Forgot password?', to: '/forgot-password' },
    };
  }

  // Network / fetch failure
  if (m.includes('failed to fetch') || m.includes('network') || m.includes('load failed')) {
    return {
      title: 'Connection problem',
      description: 'We could not reach the server. Check your internet connection and try again.',
    };
  }

  // OTP-specific
  if (m.includes('otp')) {
    return {
      title: 'OTP issue',
      description: msg || 'We could not send the OTP. Please try again in a moment.',
    };
  }

  // Fallback
  return {
    title: context === 'google' ? 'Google sign-in failed' : context === 'register' ? 'Could not create account' : 'Sign-in failed',
    description: msg || 'Something went wrong. Please try again.',
  };
};
