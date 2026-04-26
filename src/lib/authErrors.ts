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

  // Default title per context — the description is ALWAYS the raw API message
  // so users see exactly what the server reported.
  const defaultTitle =
    context === 'google'
      ? 'Google sign-in failed'
      : context === 'register'
        ? 'Could not create account'
        : 'Sign-in failed';

  // Pick a contextual recovery action based on common error shapes,
  // but keep the API message itself as the description.
  let action: FriendlyAuthError['action'];
  let title = defaultTitle;

  if (
    m.includes('already') ||
    m.includes('exists') ||
    m.includes('duplicate') ||
    m.includes('registered') ||
    m.includes('taken')
  ) {
    title = 'This email is already registered';
    action = { label: 'Go to sign in', to: '/login' };
  } else if (
    m.includes('invalid') &&
    (m.includes('credential') || m.includes('password') || m.includes('email'))
  ) {
    title = 'Invalid email or password';
    action = { label: 'Forgot password?', to: '/forgot-password' };
  } else if (m.includes('failed to fetch') || m.includes('network') || m.includes('load failed')) {
    title = 'Connection problem';
  }

  return {
    title,
    description: msg || 'Something went wrong. Please try again.',
    action,
  };
};
