import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  type AuthStep = "emailCheck" | "login" | "signup" | "forgotPassword" | "resetPassword";
  const [step, setStep] = useState<AuthStep>("emailCheck");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralError, setReferralError] = useState<string | null>(null);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validatingReferral, setValidatingReferral] = useState(false);

  // Query to verify referral code - only runs when we have a code to check
  const referralVerification = useQuery(
    api.agents.verifyReferralCode,
    referralCode.length >= 6 ? { code: referralCode } : "skip"
  );

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handleEmailCheck = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailCheckLoading(true);
    setError(null);
    
    const emailValue = email.trim().toLowerCase();
    
    try {
      // Call backend to check if email exists
      const response = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "users:checkEmailExists",
          args: { email: emailValue },
          format: "json"
        })
      });
      
      const result = await response.json();
      const exists = result?.value?.exists || false;
      
      setUserExists(exists);
      
      if (exists) {
        setStep("login");
      } else {
        setStep("signup");
      }
      setEmailCheckLoading(false);
    } catch (error) {
      console.error("Email check error:", error);
      setError("Failed to verify email. Please try again.");
      setEmailCheckLoading(false);
    }
  };

  const handleReferralValidation = async () => {
    if (referralCode.length < 6) {
      setReferralError("Referral code must be at least 6 characters");
      return false;
    }
    
    setValidatingReferral(true);
    setReferralError(null);
    
    try {
      // Wait a moment for the query to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!referralVerification) {
        setReferralError("Unable to verify referral code. Please try again.");
        setValidatingReferral(false);
        return false;
      }
      
      if (!referralVerification.valid) {
        setReferralError("Invalid referral code. Please check and try again.");
        setValidatingReferral(false);
        return false;
      }
      
      setValidatingReferral(false);
      return true;
    } catch (error) {
      console.error("Referral validation error:", error);
      setReferralError("Failed to validate referral code. Please try again.");
      setValidatingReferral(false);
      return false;
    }
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", "signIn");
      await signIn("password", formData);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Invalid email or password. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate referral code first
    const isValidReferral = await handleReferralValidation();
    if (!isValidReferral) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", "signUp");
      
      // Store referral code for post-auth initialization
      sessionStorage.setItem("pendingReferralCode", referralCode);
      
      await signIn("password", formData);
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "sendPasswordReset:sendResetEmail",
          args: { email: email.toLowerCase() },
          format: "json"
        })
      });

      if (response.ok) {
        setStep("resetPassword");
        setIsLoading(false);
      } else {
        throw new Error("Failed to send reset email");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to send reset email. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!resetToken || resetToken.length !== 6) {
      setError("Please enter the 6-digit code from your email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verify token first
      const verifyResponse = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "auth/passwordReset:verifyResetToken",
          args: { email: email.toLowerCase(), token: resetToken },
          format: "json"
        })
      });

      const verifyResult = await verifyResponse.json();
      
      if (!verifyResult?.value?.valid) {
        setError(verifyResult?.value?.expired ? "Reset code has expired" : "Invalid reset code");
        setIsLoading(false);
        return;
      }

      // Reset password
      const resetResponse = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "resetPasswordAction:resetPassword",
          args: { email: email.toLowerCase(), token: resetToken, newPassword: password },
          format: "json"
        })
      });

      if (resetResponse.ok) {
        // Auto-login with new password
        const formData = new FormData();
        formData.set("email", email);
        formData.set("password", password);
        formData.set("flow", "signIn");
        await signIn("password", formData);
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to reset password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center h-full flex-col">
        <Card className="min-w-[350px] pb-0 border shadow-md">
          {step === "emailCheck" ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img
                    src="./logo.svg"
                    alt="Lock Icon"
                    width={64}
                    height={64}
                    className="rounded-lg mb-4 mt-4 cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                </div>
                <CardTitle className="text-xl">Welcome</CardTitle>
                <CardDescription>
                  Enter your email to continue
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailCheck}>
                <CardContent>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={emailCheckLoading}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      disabled={emailCheckLoading}
                    >
                      {emailCheckLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                </CardContent>
              </form>
            </>
          ) : step === "login" ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img
                    src="./logo.svg"
                    alt="Lock Icon"
                    width={64}
                    height={64}
                    className="rounded-lg mb-4 mt-4 cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                </div>
                <CardTitle className="text-xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to {email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLoginSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => {
                        setStep("forgotPassword");
                        setPassword("");
                        setError(null);
                      }}
                    >
                      Forgot password?
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => {
                        setStep("emailCheck");
                        setEmail("");
                        setPassword("");
                      }}
                    >
                      ← Use different email
                    </Button>
                  </div>
                </CardContent>
              </form>
            </>
          ) : step === "forgotPassword" ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img
                    src="./logo.svg"
                    alt="Lock Icon"
                    width={64}
                    height={64}
                    className="rounded-lg mb-4 mt-4 cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                </div>
                <CardTitle className="text-xl">Reset Password</CardTitle>
                <CardDescription>
                  We'll send a reset code to {email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleForgotPassword}>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      <>
                        Send Reset Code
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => {
                        setStep("login");
                        setError(null);
                      }}
                    >
                      ← Back to login
                    </Button>
                  </div>
                </CardContent>
              </form>
            </>
          ) : step === "resetPassword" ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img
                    src="./logo.svg"
                    alt="Lock Icon"
                    width={64}
                    height={64}
                    className="rounded-lg mb-4 mt-4 cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                </div>
                <CardTitle className="text-xl">Enter Reset Code</CardTitle>
                <CardDescription>
                  Check your email for the 6-digit code
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="reset-token">Reset Code</Label>
                    <Input
                      id="reset-token"
                      name="resetToken"
                      placeholder="000000"
                      type="text"
                      className="text-center font-mono text-lg tracking-widest"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      disabled={isLoading}
                      required
                      maxLength={6}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enter the 6-digit code from your email
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        name="password"
                        type="password"
                        placeholder="Create a new password"
                        className="pl-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      At least 8 characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirm-new-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-new-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                        className="pl-9"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => {
                        setStep("forgotPassword");
                        setResetToken("");
                        setPassword("");
                        setConfirmPassword("");
                        setError(null);
                      }}
                    >
                      ← Resend code
                    </Button>
                  </div>
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img
                    src="./logo.svg"
                    alt="Lock Icon"
                    width={64}
                    height={64}
                    className="rounded-lg mb-4 mt-4 cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                </div>
                <CardTitle className="text-xl">Create Account</CardTitle>
                <CardDescription>
                  Enter your referral code and create a password
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignupSubmit}>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="referralCode">Referral Code</Label>
                      <Input
                        id="referralCode"
                        name="referralCode"
                        placeholder="REFERRAL CODE"
                        type="text"
                        className="uppercase font-mono text-center tracking-wider"
                        value={referralCode}
                        onChange={(e) => {
                          setReferralCode(e.target.value.toUpperCase());
                          setReferralError(null);
                        }}
                        disabled={isLoading || validatingReferral}
                        required
                        maxLength={8}
                      />
                      {referralError && (
                        <p className="mt-1 text-sm text-red-500">{referralError}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        Required to create an account
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-9"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                          minLength={8}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        At least 8 characters
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-9"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || validatingReferral || referralCode.length < 6}
                    >
                      {isLoading || validatingReferral ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {validatingReferral ? "Validating..." : "Creating account..."}
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => {
                        setStep("emailCheck");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        setReferralCode("");
                        setReferralError(null);
                      }}
                    >
                      ← Use different email
                    </Button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    Don't have a referral code? Contact an existing agent.
                  </p>
                </CardContent>
              </form>
            </>
          )}

          <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
            Secured by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              vly.ai
            </a>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}