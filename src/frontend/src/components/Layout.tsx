import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Building2,
  Compass,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  ShieldCheck,
  User,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  clearSession,
  getFullName,
  isAdmin,
  isLoggedIn,
} from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { to: "/places", label: "Places", icon: MapPin },
  { to: "/hotels", label: "Hotels", icon: Building2 },
  { to: "/guides", label: "Guides", icon: Users },
  { to: "/restaurants", label: "Restaurants", icon: Utensils },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Layout({ children }: LayoutProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const loggedIn = isLoggedIn();
  const adminUser = isAdmin();
  const displayName = getFullName();

  function handleLogout() {
    clearSession();
    queryClient.clear();
    router.navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-elevated">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.logo_link"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-smooth group-hover:scale-105">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-display font-semibold text-foreground text-sm leading-tight hidden sm:block">
              Smart Tourism
              <span className="text-primary block text-xs font-normal">
                Kanyakumari
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-secondary/8 transition-smooth [&.active-nav]:text-primary [&.active-nav]:bg-primary/8 [&.active-nav]:font-semibold"
                activeProps={{
                  className: "text-primary bg-primary/8 font-semibold",
                }}
                data-ocid={`nav.${label.toLowerCase()}_link`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {loggedIn && !adminUser && (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-secondary/8 transition-smooth"
                data-ocid="nav.profile_link"
              >
                <User className="w-[18px] h-[18px]" />
                Profile
              </Link>
            )}

            {loggedIn && adminUser && (
              <>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">
                    {displayName ?? "SEENIRAJ"}
                  </span>
                  <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 text-white border-0 ml-1">
                    Admin
                  </Badge>
                </div>
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-500/10 transition-smooth"
                  data-ocid="nav.admin_link"
                >
                  <ShieldCheck className="w-[18px] h-[18px]" />
                  Admin Panel
                </Link>
              </>
            )}

            {!loggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <a href="/login?tab=user" data-ocid="nav.user_login_button">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 transition-smooth"
                  >
                    <User className="w-3.5 h-3.5" />
                    User Login
                  </Button>
                </a>
                <a href="/login?tab=admin" data-ocid="nav.admin_login_button">
                  <Button
                    size="sm"
                    className="flex items-center gap-1.5 transition-smooth bg-amber-600 hover:bg-amber-700 text-white border-0"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Login
                  </Button>
                </a>
              </div>
            ) : (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                data-ocid="nav.logout_button"
                className="transition-smooth flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              data-ocid="nav.mobile_menu_toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-secondary/8 transition-smooth"
                activeProps={{ className: "text-primary bg-primary/8" }}
                data-ocid={`nav.mobile_${label.toLowerCase()}_link`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </Link>
            ))}

            {loggedIn && !adminUser && (
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-secondary/8 transition-smooth"
                data-ocid="nav.mobile_profile_link"
              >
                <User className="w-[18px] h-[18px]" />
                Profile
              </Link>
            )}

            {loggedIn && adminUser && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-500/10 transition-smooth"
                data-ocid="nav.mobile_admin_link"
              >
                <ShieldCheck className="w-[18px] h-[18px]" />
                Admin Panel
              </Link>
            )}

            {!loggedIn ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-border mt-1">
                <a
                  href="/login?tab=user"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.mobile_user_login_button"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    User Login
                  </Button>
                </a>
                <a
                  href="/login?tab=admin"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.mobile_admin_login_button"
                >
                  <Button
                    size="sm"
                    className="w-full flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white border-0"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Login
                  </Button>
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-smooth mt-1 border-t border-border pt-3"
                data-ocid="nav.mobile_logout_button"
              >
                <LogOut className="w-[18px] h-[18px]" />
                Sign out
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="font-display font-semibold text-foreground text-sm">
                  Smart Tourism Kanyakumari
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover the southernmost tip of India — where oceans meet and
                sunrises astound.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">
                Explore
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">
                Contact
              </h4>
              <p className="text-sm text-muted-foreground">+17 9122 6350</p>
              <p className="text-sm text-muted-foreground">
                kanyakumari@gmail.com
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
