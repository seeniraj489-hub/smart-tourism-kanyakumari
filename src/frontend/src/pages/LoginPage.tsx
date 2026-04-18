import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Lock,
  LogIn,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import {
  ADMIN_EMAIL,
  saveAdminSession,
  saveSession,
  useLoginMutation,
  useRegisterMutation,
} from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  // Read ?tab= param from URL without strict typing to avoid route coupling
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const tabParam = params.get("tab");
  const defaultTab =
    tabParam === "admin"
      ? "admin"
      : tabParam === "register"
        ? "register"
        : "signin";

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    username: "",
    mobileNumber: "",
    password: "",
    confirm: "",
  });
  const [loginError, setLoginError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!loginForm.username || !loginForm.password) {
      setLoginError("Please enter your username and password.");
      return;
    }
    const result = await loginMutation.mutateAsync({
      username: loginForm.username,
      password: loginForm.password,
    });
    if (result.__kind__ === "ok") {
      saveSession(result.ok.token, result.ok.username);
      navigate({ to: "/" });
    } else {
      setLoginError(result.err || "Invalid username or password.");
    }
  }

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setAdminError("");
    const emailTrimmed = adminForm.email.trim().toLowerCase();
    if (!emailTrimmed || !adminForm.password) {
      setAdminError("Please enter your admin email and password.");
      return;
    }
    if (emailTrimmed !== ADMIN_EMAIL.toLowerCase()) {
      setAdminError("Access denied. Invalid admin credentials.");
      return;
    }
    saveAdminSession(emailTrimmed);
    navigate({ to: "/admin" });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    if (
      !registerForm.fullName.trim() ||
      registerForm.fullName.trim().length < 2
    ) {
      setRegisterError("Full name must be at least 2 characters.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !registerForm.email.trim() ||
      !emailRegex.test(registerForm.email.trim())
    ) {
      setRegisterError("Please enter a valid email address.");
      return;
    }
    if (!registerForm.username.trim()) {
      setRegisterError("Please choose a username.");
      return;
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(registerForm.mobileNumber.trim())) {
      setRegisterError("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!registerForm.password) {
      setRegisterError("Please create a password.");
      return;
    }
    if (registerForm.password.length < 6) {
      setRegisterError("Password must be at least 6 characters.");
      return;
    }
    if (registerForm.password !== registerForm.confirm) {
      setRegisterError("Passwords do not match.");
      return;
    }

    const result = await registerMutation.mutateAsync({
      username: registerForm.username,
      password: registerForm.password,
      fullName: registerForm.fullName.trim(),
      email: registerForm.email.trim(),
      mobileNumber: registerForm.mobileNumber.trim(),
    });

    if (result.__kind__ === "ok") {
      saveSession(
        result.ok,
        registerForm.username,
        registerForm.fullName.trim(),
        registerForm.email.trim(),
        registerForm.mobileNumber.trim(),
      );
      setRegisterSuccess("Account created! You can now sign in.");
      setRegisterForm({
        fullName: "",
        email: "",
        username: "",
        mobileNumber: "",
        password: "",
        confirm: "",
      });
    } else {
      setRegisterError(
        result.err || "Registration failed. Try a different username.",
      );
    }
  }

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-12"
      data-ocid="login.page"
    >
      {/* Background decorative blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <span className="text-3xl">🌊</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
            Smart Tourism
          </h1>
          <p className="text-accent font-semibold tracking-wide text-sm mt-0.5">
            Kanyakumari
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Explore the land where three seas meet
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList
              className="w-full rounded-none border-b border-border bg-muted/40 h-12"
              data-ocid="login.tab"
            >
              <TabsTrigger
                value="signin"
                className="flex-1 h-full rounded-none data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-none font-medium text-xs sm:text-sm"
                data-ocid="login.signin_tab"
              >
                <User className="w-4 h-4 mr-1" />
                User Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 h-full rounded-none data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-none font-medium text-xs sm:text-sm"
                data-ocid="login.register_tab"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Register
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex-1 h-full rounded-none data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-none font-medium text-xs sm:text-sm"
                data-ocid="login.admin_tab"
              >
                <ShieldCheck className="w-4 h-4 mr-1" />
                Admin
              </TabsTrigger>
            </TabsList>

            {/* User Sign In Tab */}
            <TabsContent value="signin" className="p-6 space-y-5">
              {/* User login badge */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
                <User className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Sign in with your{" "}
                  <span className="font-semibold text-foreground">
                    username &amp; password
                  </span>
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-username"
                    className="text-foreground font-medium"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm((f) => ({
                          ...f,
                          username: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="username"
                      data-ocid="login.username_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-password"
                    className="text-foreground font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((f) => ({
                          ...f,
                          password: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="current-password"
                      data-ocid="login.password_input"
                    />
                  </div>
                </div>

                {loginError && (
                  <p
                    className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                    data-ocid="login.error_state"
                  >
                    {loginError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold transition-smooth"
                  disabled={loginMutation.isPending}
                  data-ocid="login.submit_button"
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="p-6 space-y-5">
              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-fullname"
                    className="text-foreground font-medium"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-fullname"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerForm.fullName}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          fullName: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="name"
                      data-ocid="register.fullname_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-email"
                    className="text-foreground font-medium"
                  >
                    Email ID <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          email: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="email"
                      data-ocid="register.email_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-username"
                    className="text-foreground font-medium"
                  >
                    Username <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-username"
                      type="text"
                      placeholder="Choose a username"
                      value={registerForm.username}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          username: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="username"
                      data-ocid="register.username_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-mobile"
                    className="text-foreground font-medium"
                  >
                    Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={registerForm.mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setRegisterForm((f) => ({ ...f, mobileNumber: val }));
                      }}
                      className="pl-9"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      data-ocid="register.mobile_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-password"
                    className="text-foreground font-medium"
                  >
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Create a password (min 6 chars)"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          password: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="new-password"
                      data-ocid="register.password_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-confirm"
                    className="text-foreground font-medium"
                  >
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="Repeat your password"
                      value={registerForm.confirm}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          confirm: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="new-password"
                      data-ocid="register.confirm_input"
                    />
                  </div>
                </div>

                {registerError && (
                  <p
                    className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                    data-ocid="register.error_state"
                  >
                    {registerError}
                  </p>
                )}

                {registerSuccess && (
                  <p
                    className="text-sm text-secondary bg-secondary/10 rounded-lg px-3 py-2"
                    data-ocid="register.success_state"
                  >
                    {registerSuccess}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold transition-smooth"
                  disabled={registerMutation.isPending}
                  data-ocid="register.submit_button"
                >
                  {registerMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Admin Login Tab */}
            <TabsContent value="admin" className="p-6 space-y-5">
              {/* Admin badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Admin Access Only
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Restricted to authorised administrators
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleAdminLogin}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="admin-email"
                    className="text-foreground font-medium"
                  >
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter admin email address"
                      value={adminForm.email}
                      onChange={(e) =>
                        setAdminForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="pl-9"
                      autoComplete="email"
                      data-ocid="admin_login.email_input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="admin-password"
                    className="text-foreground font-medium"
                  >
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminForm.password}
                      onChange={(e) =>
                        setAdminForm((f) => ({
                          ...f,
                          password: e.target.value,
                        }))
                      }
                      className="pl-9"
                      autoComplete="current-password"
                      data-ocid="admin_login.password_input"
                    />
                  </div>
                </div>

                {adminError && (
                  <p
                    className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                    data-ocid="admin_login.error_state"
                  >
                    {adminError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold transition-smooth bg-amber-600 hover:bg-amber-700 text-white"
                  data-ocid="admin_login.submit_button"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Admin Sign In
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Back to explore */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <a
            href="/"
            className="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors"
            data-ocid="login.back_link"
          >
            ← Continue browsing without signing in
          </a>
        </p>
      </div>
    </div>
  );
}
