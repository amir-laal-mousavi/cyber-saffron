import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Edit, LogOut, CheckCircle, Copy, QrCode, Share2, Wand2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTierColor } from "@/lib/tiers";

interface AgentHeaderProps {
  user: any;
  dashboardData: any;
  onEditProfile: () => void;
  onSignOut: () => void;
  onShowQrCode: () => void;
}

export function AgentHeader({ 
  user, 
  dashboardData, 
  onEditProfile, 
  onSignOut,
  onShowQrCode 
}: AgentHeaderProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const generateReferralCode = useMutation(api.agents.generateReferralCode);

  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedCode(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShareReferralCode = () => {
    if (user?.referralCode) {
      const shareUrl = `${window.location.origin}/auth?ref=${user.referralCode}`;
      if (navigator.share) {
        navigator.share({
          title: "Join Cyber Saffron",
          text: `Use my referral code: ${user.referralCode}`,
          url: shareUrl,
        }).catch(() => {
          navigator.clipboard.writeText(shareUrl);
          toast.success("Referral link copied!");
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Referral link copied to clipboard!");
      }
    }
  };

  const handleGenerateReferralCode = async () => {
    setIsGeneratingCode(true);
    try {
      const result = await generateReferralCode({});
      if (result.success) {
        toast.success(`Referral Code ${result.referralCode} created successfully!`, {
          description: "Your unique tracking ID is now active.",
        });
      } else {
        toast.info(result.message || "Referral code already exists");
      }
    } catch (error) {
      toast.error("Failed to generate referral code. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {user.name || "Agent"}
                {dashboardData?.agent.tier && (
                  <Badge variant="outline" className={getTierColor(dashboardData.agent.tier)}>
                    {dashboardData.agent.tier.toUpperCase()}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email || "No email provided"}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onEditProfile}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        {user.referralCode ? (
          <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">My Referral Key</p>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Active & Tracking
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <code className="text-3xl font-bold font-mono tracking-widest text-primary block">
                  {user.referralCode}
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyReferralCode}
                className="flex-1"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onShowQrCode}
                className="flex-1"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareReferralCode}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-6 bg-muted/30 rounded-lg border border-border/50 text-center">
            <div className="mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Generate Your Referral Code</h4>
              <p className="text-sm text-muted-foreground">
                Click to create your permanent ID for tracking commissions.
              </p>
            </div>
            <Button
              onClick={handleGenerateReferralCode}
              disabled={isGeneratingCode}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isGeneratingCode ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate My Unique Referral Code
                </>
              )}
            </Button>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}