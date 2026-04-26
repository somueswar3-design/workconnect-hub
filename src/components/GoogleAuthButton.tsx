import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Briefcase, Users } from 'lucide-react';
import { authApi } from '@/services/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { toFriendlyAuthError, type FriendlyAuthError } from '@/lib/authErrors';

const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
  '517143632383-dfsqhm0t6kv1fh92m6rt4o6baejq5i46.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleAuthButtonProps {
  /** If provided, skip the role chooser dialog. */
  presetRole?: 'FreeLancer' | 'Client';
  /** Button label */
  label?: string;
  /** Optional callback so the parent page can render an inline error UI instead of a toast. */
  onError?: (err: FriendlyAuthError) => void;
}

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 7 29.5 4.5 24 4.5c-7.7 0-14.4 4.4-17.7 10.2z"/>
    <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.2c-2 1.4-4.5 2.3-7.4 2.3-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-2 4-3.7 5.4l6.3 5.2C42 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"/>
  </svg>
);

export const GoogleAuthButton = ({ presetRole, label = 'Continue with Google', onError }: GoogleAuthButtonProps) => {
  const [scriptReady, setScriptReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const idTokenRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => setScriptReady(true));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
  }, []);

  const completeLogin = async (idToken: string, role: string) => {
    setIsLoading(true);
    try {
      const result = await authApi.googleLogin({ idToken, role });
      login(result.token, { email: result.user?.email || '', role });
      toast.success('Signed in with Google!');
      navigate('/');
    } catch (e: any) {
      const friendly = toFriendlyAuthError(e, 'google');
      if (onError) {
        onError(friendly);
        // Close the role-picker dialog so the inline alert is visible behind it.
        setShowRolePicker(false);
      } else {
        toast.error(friendly.description);
      }
    } finally {
      setIsLoading(false);
      setShowRolePicker(false);
      idTokenRef.current = null;
    }
  };

  const handleCredential = (response: any) => {
    const idToken = response?.credential;
    if (!idToken) {
      toast.error('Google did not return a credential.');
      return;
    }
    idTokenRef.current = idToken;
    if (presetRole) {
      completeLogin(idToken, presetRole);
    } else {
      setShowRolePicker(true);
    }
  };

  const openOAuthPopup = () => {
    // Fallback: open a centered popup using OAuth 2.0 implicit flow to get an id_token directly.
    const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      response_type: 'id_token',
      scope: 'openid email profile',
      redirect_uri: redirectUri,
      nonce,
      prompt: 'select_account',
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    const w = 480;
    const h = 600;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      url,
      'google-oauth',
      `width=${w},height=${h},left=${left},top=${top}`,
    );
    if (!popup) {
      toast.error('Popup blocked. Please allow popups for this site.');
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'google-oauth-id-token') return;
      const idToken = event.data.idToken as string | undefined;
      window.removeEventListener('message', handleMessage);
      try { popup.close(); } catch {}
      if (!idToken) {
        toast.error('Google did not return a credential.');
        return;
      }
      idTokenRef.current = idToken;
      if (presetRole) {
        completeLogin(idToken, presetRole);
      } else {
        setShowRolePicker(true);
      }
    };
    window.addEventListener('message', handleMessage);
  };

  const handleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error('Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID.');
      return;
    }
    if (!scriptReady || !window.google?.accounts?.id) {
      toast.info('Loading Google Sign-In...');
      return;
    }
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        ux_mode: 'popup',
        auto_select: false,
      });
      window.google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
          // One Tap suppressed (common in dev/preview). Use redirect-based popup that returns an id_token.
          openOAuthPopup();
        }
      });
    } catch (e) {
      console.error(e);
      openOAuthPopup();
    }
  };

  const RoleCard = ({
    role,
    icon: Icon,
    title,
    desc,
    variant,
  }: {
    role: 'FreeLancer' | 'Client';
    icon: typeof Briefcase;
    title: string;
    desc: string;
    variant: 'emerald' | 'blue';
  }) => {
    const styles =
      variant === 'emerald'
        ? 'hover:border-emerald-500 hover:bg-emerald-50'
        : 'hover:border-blue-500 hover:bg-blue-50';
    const iconWrap =
      variant === 'emerald'
        ? 'bg-emerald-100 group-hover:bg-emerald-200'
        : 'bg-blue-100 group-hover:bg-blue-200';
    const iconColor = variant === 'emerald' ? 'text-emerald-600' : 'text-blue-600';
    return (
      <button
        onClick={() => idTokenRef.current && completeLogin(idTokenRef.current, role)}
        disabled={isLoading}
        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 ${styles} transition-all group text-left disabled:opacity-50`}
      >
        <div className={`h-12 w-12 rounded-xl ${iconWrap} flex items-center justify-center transition-colors`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </button>
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        {label}
      </Button>

      <Dialog open={showRolePicker} onOpenChange={(o) => !isLoading && setShowRolePicker(o)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Choose your role</DialogTitle>
            <DialogDescription>
              How would you like to use WorkSupport360?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <RoleCard
              role="FreeLancer"
              icon={Briefcase}
              title="I'm a Freelancer"
              desc="Offer your skills and find projects"
              variant="emerald"
            />
            <RoleCard
              role="Client"
              icon={Users}
              title="I need Work Support"
              desc="Hire freelancers for your projects"
              variant="blue"
            />
          </div>
          {isLoading && (
            <div className="flex items-center justify-center gap-2 pt-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Signing you in...
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleAuthButton;
