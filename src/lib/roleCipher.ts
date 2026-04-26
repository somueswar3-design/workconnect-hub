/**
 * Lightweight URL-safe obfuscation for the `role` query param on the Register page.
 *
 * Goal: prevent the role from appearing as readable plain text in the URL
 * (e.g. `?role=Client`). This is NOT cryptographic security — the backend
 * MUST re-validate the role on every request. It only stops casual inspection
 * and link-sharing leaks.
 *
 * Format: URL-safe base64 of (XOR(plaintext, key)).
 */

const KEY = 'ws360-role-cipher-v1';

const xor = (input: string): string => {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(input.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
  }
  return out;
};

const toUrlSafe = (b64: string) => b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromUrlSafe = (s: string) => {
  const fixed = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = fixed.length % 4 === 0 ? '' : '='.repeat(4 - (fixed.length % 4));
  return fixed + pad;
};

export const encryptRole = (role: string): string => {
  try {
    return toUrlSafe(btoa(xor(role)));
  } catch {
    return '';
  }
};

export const decryptRole = (token: string): string => {
  try {
    if (!token) return '';
    const decoded = atob(fromUrlSafe(token));
    const plain = xor(decoded);
    // Whitelist — never trust the URL to set arbitrary roles.
    if (plain === 'FreeLancer') return 'FreeLancer';
    if (plain === 'Client') return 'Client';
    return '';
  } catch {
    return '';
  }
};
