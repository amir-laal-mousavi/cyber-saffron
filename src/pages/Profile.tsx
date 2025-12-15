import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Wallet, Download, Users, Maximize2, TrendingUp, DollarSign, User, Edit } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";
import { NetworkTree } from "@/components/NetworkTree";
import { QRCodeCanvas } from "qrcode.react";
import { AgentHeader } from "@/components/profile/AgentHeader";
import { PerformanceMetrics } from "@/components/profile/PerformanceMetrics";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { SaffronLoader } from "@/components/SaffronLoader";

export default function Profile() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const { address, isConnected } = useAccount();
  const orders = useQuery(api.orders.list);
  const updateProfile = useMutation(api.users.updateProfile);
  const dashboardData = useQuery(api.agents.getDashboardData);
  const networkTree = useQuery(api.agents.getNetworkTree, { depth: 3 });
  const seedTestNetwork = useMutation(api.agents.seedTestNetwork);

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
  const [showQrCode, setShowQrCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

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

  const handleDownloadQrCode = () => {
    if (!qrCodeRef.current) return;
    
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cyber-saffron-referral-${user?.referralCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded successfully!");
    });
  };

  const handleSeedTestData = async () => {
    try {
      await seedTestNetwork({});
      toast.success("Test network data added!", {
        description: "Refresh to see the network tree visualization",
      });
    } catch (error) {
      toast.error("Failed to seed test data");
      console.error(error);
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
    return <SaffronLoader />;
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
          <AgentHeader 
            user={user} 
            dashboardData={dashboardData} 
            onEditProfile={() => setEditDialogOpen(true)}
            onSignOut={handleSignOut}
            onShowQrCode={() => setShowQrCode(true)}
          />

          <PerformanceMetrics dashboardData={dashboardData} />

          {/* Network Hierarchy Visualization */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    My Network Performance Hierarchy
                  </CardTitle>
                  <CardDescription>
                    Interactive visualization of your agent network and their performance
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeedTestData}
                  >
                    Add Test Data
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate("/network")}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Full View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <NetworkTree data={networkTree} />
            </CardContent>
          </Card>

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
                  {dashboardData.referrals.map((referral: any) => (
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
                  {dashboardData.recentCommissions.map((commission: any) => (
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

          <OrderHistory orders={orders} />
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
            <div className="bg-white p-6 rounded-lg border-4 border-primary/20 shadow-lg" ref={qrCodeRef}>
              {user?.referralCode && (
                <QRCodeCanvas
                  value={`${window.location.origin}/auth?ref=${user.referralCode}`}
                  size={256}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo.png",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Scan to join with referral code: <span className="font-mono font-bold text-primary">{user?.referralCode}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-sm">
              {`${window.location.origin}/auth?ref=${user?.referralCode}`}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQrCode(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadQrCode}>
              <Download className="h-4 w-4 mr-2" />
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