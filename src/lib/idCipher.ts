/**
 * URL-safe obfuscation for numeric/string IDs in route params.
 *
 * Goal: avoid exposing raw resource IDs (e.g. /professional/8) in URLs.
 * NOT cryptographic security — backend MUST authorize every request.
 * Produces short, URL-safe tokens (no long base64 blobs).
 */

const KEY = 'ws360-id-cipher-v1';

const xor = (input: string): string => {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(input.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
  }
  return out;
};

const toUrlSafe = (b64: string) =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromUrlSafe = (s: string) => {
  const fixed = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = fixed.length % 4 === 0 ? '' : '='.repeat(4 - (fixed.length % 4));
  return fixed + pad;
};

export const encodeId = (id: string | number | undefined | null): string => {
  if (id === undefined || id === null || id === '') return '';
  try {
    return toUrlSafe(btoa(xor(String(id))));
  } catch {
    return '';
  }
};

export const decodeId = (token: string | undefined | null): string => {
  if (!token) return '';
  try {
    // Backwards-compat: if it's already a plain numeric id, return it.
    if (/^\d+$/.test(token)) return token;
    const decoded = atob(fromUrlSafe(token));
    const plain = xor(decoded);
    // Only allow safe id characters (digits, letters, dashes).
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(plain)) return '';
    return plain;
  } catch {
    return '';
  }
};
