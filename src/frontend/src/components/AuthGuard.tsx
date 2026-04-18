import { Lock } from "lucide-react";
import { isAdmin, isLoggedIn } from "../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiresLocalAuth?: boolean;
}

export default function AuthGuard({
  children,
  adminOnly = false,
  requiresLocalAuth = false,
}: AuthGuardProps) {
  // Admin-only routes: check localStorage isAdmin flag
  if (adminOnly) {
    if (!isAdmin()) {
      return (
        <div
          className="flex items-center justify-center min-h-[50vh]"
          data-ocid="auth_guard.error_state"
        >
          <div className="text-center space-y-4 max-w-sm mx-auto px-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Admin Access Required
            </h2>
            <p className="text-sm text-muted-foreground">
              This area is restricted to administrators only. Please sign in
              with admin credentials.
            </p>
            <a
              href="/login?tab=admin"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-600 text-white text-sm font-medium transition-smooth hover:bg-amber-700"
              data-ocid="auth_guard.admin_login_link"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Local auth check (username/password)
  if (requiresLocalAuth && !isLoggedIn()) {
    return (
      <div
        className="flex items-center justify-center min-h-[50vh]"
        data-ocid="auth_guard.error_state"
      >
        <div className="text-center space-y-4 max-w-sm mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Sign in required
          </h2>
          <p className="text-sm text-muted-foreground">
            Please sign in to access this page.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-smooth hover:opacity-90"
            data-ocid="auth_guard.login_link"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
