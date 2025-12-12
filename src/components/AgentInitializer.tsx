import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function AgentInitializer() {
  const { user } = useAuth();
  const initializeAgent = useMutation(api.agents.initializeAgent);

  useEffect(() => {
    const initAgent = async () => {
      if (user && !user.referralCode) {
        const pendingCode = sessionStorage.getItem("pendingReferralCode");
        if (pendingCode) {
          try {
            const result = await initializeAgent({ referralCode: pendingCode });
            if (result.success) {
              toast.success("Agent account initialized!", {
                description: `Your referral code: ${result.referralCode}`,
              });
              sessionStorage.removeItem("pendingReferralCode");
            }
          } catch (error) {
            console.error("Failed to initialize agent:", error);
          }
        }
      }
    };
    
    if (user) {
      initAgent();
    }
  }, [user, initializeAgent]);

  return null;
}
