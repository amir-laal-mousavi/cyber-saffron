import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Package, User, Wallet, LogOut, Mail, Edit, TrendingUp, Users, DollarSign, Copy, CheckCircle, Wand2, QrCode, Share2, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const { address, isConnected } = useAccount();
  const orders = useQuery(api.orders.list);
  const updateProfile = useMutation(api.users.updateProfile);
  const initializeAgent = useMutation(api.agents.initializeAgent);
  const generateReferralCode = useMutation(api.agents.generateReferralCode);
  const dashboardData = useQuery(api.agents.getDashboardData);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Check for pending referral code and initialize agent
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
            toast.error("Failed to initialize agent account. Please contact support.");
          }
        }
      }
    };
    
    if (user) {
      initAgent();
    }
  }, [user, initializeAgent]);

  useEffect(() => {
    if (user?.name) {
      setEditName(user.name);
    }
    if (user?.billingAddress) {
      setBillingAddress(user.billingAddress);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name: editName });
      toast.success("Profile updated successfully!");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleSaveBillingAddress = async () => {
    try {
      await updateProfile({ billingAddress });
      toast.success("Billing address updated successfully!");
      setBillingDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update billing address");
      console.error(error);
    }
  };

  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedCode(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
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

  const handleShareReferralCode = () => {
    if (user?.referralCode) {
      const shareUrl = `${window.location.origin}/auth?ref=${user.referralCode}`;
      if (navigator.share) {
        navigator.share({
          title: "Join Cyber Saffron",
          text: `Use my referral code: ${user.referralCode}`,
          url: shareUrl,
        }).catch(() => {
          // Fallback to copy
          navigator.clipboard.writeText(shareUrl);
          toast.success("Referral link copied!");
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Referral link copied to clipboard!");
      }
    }
  };

  const handleGenerateQrCode = () => {
    if (user?.referralCode) {
      setShowQrCode(true);
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "platinum": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "gold": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "silver": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="ml-4 font-semibold">Agent Dashboard</span>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Agent Info Header */}
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
                  <Button variant="outline" size="icon" onClick={() => setEditDialogOpen(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
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
                      onClick={handleGenerateQrCode}
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

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboardData?.agent.totalSales?.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime sales volume
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ${dashboardData?.agent.totalCommission?.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All-time earnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.network.totalDownline || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {dashboardData?.network.directReferrals || 0} direct referrals
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Direct Referrals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Direct Referrals
              </CardTitle>
              <CardDescription>
                Agents you've directly recruited
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!dashboardData?.referrals || dashboardData.referrals.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No referrals yet</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share your referral code to grow your network
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{referral.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(referral.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={getTierColor(referral.tier)}>
                          {referral.tier}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          ${referral.totalSales.toFixed(2)} sales
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Commissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Commissions
              </CardTitle>
              <CardDescription>
                Your latest commission earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!dashboardData?.recentCommissions || dashboardData.recentCommissions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No commissions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.recentCommissions.map((commission) => (
                    <div
                      key={commission._id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          Order #{commission.orderId.slice(-8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(commission._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">
                          +${commission.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(commission.percentage * 100).toFixed(0)}% commission
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Address Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                  <CardDescription>
                    Manage your default billing and shipping address
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={() => setBillingDialogOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {user.billingAddress ? (
                <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                  <p className="font-medium">{user.billingAddress.name}</p>
                  <p className="text-sm text-muted-foreground">{user.billingAddress.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.billingAddress.city}, {user.billingAddress.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.billingAddress.country}</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">No billing address saved</p>
                  <Button variant="outline" onClick={() => setBillingDialogOpen(true)}>
                    Add Billing Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Connection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Connection
              </CardTitle>
              <CardDescription>
                Connect your wallet to make purchases with cryptocurrency
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Connected Wallet</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Connected
                    </Badge>
                  </div>
                  <ConnectButton />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    No wallet connected. Connect your wallet to make purchases.
                  </p>
                  <ConnectButton />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>
                View your past orders and track shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!orders || orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/")}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">
                            Order #{order._id.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order._creationTime).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {item.quantity}x {item.productName} ({item.variant})
                            </span>
                            <span className="font-mono">
                              ${item.priceUsd.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <div className="text-right">
                          <p className="font-bold font-mono">
                            ${order.totalUsd.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {order.totalEth.toFixed(4)} ETH
                          </p>
                        </div>
                      </div>
                      {order.transactionHash && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Transaction: {order.transactionHash.slice(0, 10)}...
                            {order.transactionHash.slice(-8)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Billing Address Dialog */}
      <Dialog open={billingDialogOpen} onOpenChange={setBillingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Billing Address</DialogTitle>
            <DialogDescription>
              Update your default billing and shipping address
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="billing-name">Full Name</Label>
              <Input
                id="billing-name"
                value={billingAddress.name}
                onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing-address">Street Address</Label>
              <Input
                id="billing-address"
                value={billingAddress.address}
                onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="billing-city">City</Label>
                <Input
                  id="billing-city"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billing-postal">Postal Code</Label>
                <Input
                  id="billing-postal"
                  value={billingAddress.postalCode}
                  onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing-country">Country</Label>
              <Input
                id="billing-country"
                value={billingAddress.country}
                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                placeholder="Enter country"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBillingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBillingAddress}>
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Referral Code QR</DialogTitle>
            <DialogDescription>
              Share this QR code for easy sign-ups
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="bg-white p-6 rounded-lg border-4 border-primary/20">
              <div className="w-64 h-64 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">QR Code Preview</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {user?.referralCode}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Scan to join with referral code: <span className="font-mono font-bold text-primary">{user?.referralCode}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQrCode(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast.success("QR code download feature coming soon!");
            }}>
              Download QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email || ""}
                disabled
                className="opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}