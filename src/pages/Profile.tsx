import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Package, User, Wallet, LogOut, Mail } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Profile() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const { address, isConnected } = useAccount();
  const orders = useQuery(api.orders.list);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="ml-4 font-semibold">Profile</span>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container px-4 md:px-8 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {user.name || "Cyber Saffron User"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {user.email || "No email provided"}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
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
    </div>
  );
}
