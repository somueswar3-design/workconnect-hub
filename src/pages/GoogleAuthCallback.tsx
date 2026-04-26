import { useEffect } from 'react';

/**
 * Receives the id_token from Google's OAuth implicit flow (in URL hash),
 * posts it back to the opener window, and closes the popup.
 */
const GoogleAuthCallback = () => {
  useEffect(() => {
    try {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const idToken = params.get('id_token');
      const error = params.get('error');

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'google-oauth-id-token',
            idToken: idToken || null,
            error: error || null,
          },
          window.location.origin,
        );
      }
    } catch (e) {
      // ignore
    } finally {
      setTimeout(() => {
        try { window.close(); } catch {}
      }, 50);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Completing Google sign-in...</p>
    </div>
  );
};

export default GoogleAuthCallback;
