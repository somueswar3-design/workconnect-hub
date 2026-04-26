import { AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { FriendlyAuthError } from '@/lib/authErrors';

interface Props {
  error: FriendlyAuthError | null;
  onDismiss?: () => void;
}

/**
 * Inline, branded auth-error alert. Replaces noisy raw toasts with a clear
 * card that explains what went wrong and offers a one-click recovery link.
 */
export const AuthErrorAlert = ({ error, onDismiss }: Props) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="auth-error"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-900">{error.title}</p>
              <p className="mt-0.5 text-sm text-red-700/90 leading-relaxed">
                {error.description}
              </p>
              {error.action && (
                <Link
                  to={error.action.to}
                  className="mt-2 inline-block text-sm font-semibold text-red-700 underline-offset-2 hover:underline"
                >
                  {error.action.label} →
                </Link>
              )}
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="shrink-0 rounded-md p-1 text-red-500 hover:bg-red-100 hover:text-red-700"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
