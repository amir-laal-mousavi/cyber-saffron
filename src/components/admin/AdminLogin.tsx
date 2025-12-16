import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { SaffronLoader } from "@/components/SaffronLoader";
import { toast } from "sonner";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      toast.success("Admin access granted");
      onLogin();
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Invalid credentials. If you haven't set up your account, please Sign Up first.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95">
      <Card className="w-full max-w-md border-primary/20 bg-black/50 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Settings className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold tracking-tight">
            Master Control
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Restricted Access Area
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-primary/10 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Passkey"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-primary/10 focus:border-primary/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
              disabled={isLoading}
            >
              {isLoading ? <SaffronLoader /> : "Authenticate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
