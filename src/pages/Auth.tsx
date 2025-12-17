import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Mail, ArrowRight, Loader2, KeyRound, Users } from "lucide-react";

export default function AuthPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState<"email" | "otp" | "referral">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const checkEmailExists = useQuery(api.users.checkEmailExists, email ? { email } : "skip");
  const verifyReferralCode = useQuery(api.agents.verifyReferralCode, referralCode ? { code: referralCode } : "skip");
  const initializeAgent = useMutation(api.agents.initializeAgent);

  // Auto-fill referral code from URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("email", { email });
      setStep("otp");
      toast.success("Verification code sent", {
        description: "Check your email for the code"
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send code", {
        description: "Please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user exists before verifying OTP
      const userExists = checkEmailExists?.exists;
      
      if (userExists) {
        // Existing user - sign in directly
        const formData = new FormData();
        formData.append("email", email);
        formData.append("code", code);
        await signIn("email", formData);
        toast.success("Welcome back!");
        // Redirect handled by useEffect
      } else {
        // New user - proceed to referral step
        setIsNewUser(true);
        setStep("referral");
        toast.info("New account detected", {
          description: "Please enter a referral code to continue"
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid code", {
        description: "Please check the code and try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referralCode) {
      toast.error("Referral code is required");
      return;
    }

    if (!verifyReferralCode?.valid) {
      toast.error("Invalid referral code");
      return;
    }

    setIsLoading(true);
    try {
      // Complete the sign-in with OTP
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", code);
      await signIn("email", formData);
      
      // Store referral code for AgentInitializer to process
      sessionStorage.setItem("pendingReferralCode", referralCode);
      
      toast.success("Account created successfully!");
      // Redirect handled by useEffect
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account", {
        description: "Please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
             <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
             </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "email" && "Welcome"}
            {step === "otp" && "Verify Email"}
            {step === "referral" && "Join the Network"}
          </CardTitle>
          <CardDescription>
            {step === "email" && "Sign in or create an account with your email"}
            {step === "otp" && `Enter the 6-digit code sent to ${email}`}
            {step === "referral" && "Enter a referral code to complete your registration"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Continue with Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    disabled={isLoading}
                    className="pl-9 text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep("email")}
                disabled={isLoading}
              >
                Change Email
              </Button>
            </form>
          )}

          {step === "referral" && (
            <form onSubmit={handleCompleteSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referral">Referral Code *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="referral"
                    type="text"
                    placeholder="REFERRAL-CODE"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    required
                    disabled={isLoading}
                    className="pl-9 font-mono uppercase"
                  />
                </div>
                {referralCode && verifyReferralCode && (
                  <p className={`text-sm ${verifyReferralCode.valid ? 'text-green-500' : 'text-destructive'}`}>
                    {verifyReferralCode.valid 
                      ? `✓ Valid code from ${verifyReferralCode.agentName}` 
                      : '✗ Invalid referral code'}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !referralCode || !verifyReferralCode?.valid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep("otp")}
                disabled={isLoading}
              >
                Back
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}