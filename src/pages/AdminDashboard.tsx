import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaffronLoader } from "@/components/SaffronLoader";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  FileText, 
  Settings,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminDashboard() {
  const { isAuthenticated, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const user = useQuery(api.users.currentUser);
  const stats = useQuery(api.admin.getDashboardStats);

  // Separate Admin Login System
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => signIn("password")} />;
  }

  // Access Control
  if (user === undefined) return <SaffronLoader />;
  
  if (!user || (user.role !== "admin" && user.role !== "sub_admin")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          You do not have permission to access this area. This attempt has been logged.
        </p>
        <Button onClick={() => window.location.href = "/"}>Return Home</Button>
      </div>
    );
  }

  if (!stats) return <SaffronLoader />;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-muted/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-border/40">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeTab === "overview" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </Button>
          <Button 
            variant={activeTab === "users" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" /> Users & Network
          </Button>
          <Button 
            variant={activeTab === "products" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("products")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Products
          </Button>
          <Button 
            variant={activeTab === "financials" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("financials")}
          >
            <DollarSign className="mr-2 h-4 w-4" /> Financials
          </Button>
          <Button 
            variant={activeTab === "cms" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("cms")}
          >
            <FileText className="mr-2 h-4 w-4" /> CMS
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">+180 new users</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commission Liability</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-500">${stats.totalCommissionLiability.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Pending payouts</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && <UserManagement />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "financials" && <FinancialManagement />}
          {activeTab === "cms" && <CMSManagement />}
        </div>
      </main>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
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
    } catch (error) {
      toast.error("Invalid credentials");
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
                placeholder="Admin ID"
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

function UserManagement() {
  const users = useQuery(api.admin.listUsers, {});
  const updateUser = useMutation(api.admin.updateUser);
  const [search, setSearch] = useState("");

  const filteredUsers = users?.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBan = async (userId: Id<"users">, currentStatus: boolean | undefined) => {
    try {
      await updateUser({ userId, isBanned: !currentStatus });
      toast.success(currentStatus ? "User unbanned" : "User banned");
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50">
              <div className="col-span-2">User</div>
              <div>Role</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            <ScrollArea className="h-[600px]">
              {filteredUsers?.map((user) => (
                <div key={user._id} className="grid grid-cols-5 gap-4 p-4 items-center border-b last:border-0 hover:bg-muted/5">
                  <div className="col-span-2">
                    <div className="font-medium">{user.name || "Anonymous"}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div>
                    <Badge variant="outline">{user.role || "user"}</Badge>
                  </div>
                  <div>
                    {user.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">Active</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <Button 
                      variant={user.isBanned ? "outline" : "destructive"} 
                      size="sm"
                      onClick={() => handleBan(user._id, user.isBanned)}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductManagement() {
  const products = useQuery(api.products.list);
  const updateProduct = useMutation(api.admin.updateProduct);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Product Inventory</h2>
      <div className="grid grid-cols-1 gap-6">
        {products?.map((product) => (
          <Card key={product._id}>
            <CardContent className="p-6 flex items-center gap-6">
              <div className="h-24 w-24 rounded-lg bg-muted overflow-hidden shrink-0">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <div className="flex gap-4">
                  <Badge variant="outline">{product.tier}</Badge>
                  <Badge variant="outline">{product.weight}</Badge>
                </div>
              </div>
              <div className="w-48 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price (USD)</span>
                  <Input 
                    type="number" 
                    defaultValue={product.priceUsd}
                    className="w-24 h-8"
                    onBlur={(e) => updateProduct({ 
                      productId: product._id, 
                      priceUsd: parseFloat(e.target.value) 
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <Input 
                    type="number" 
                    defaultValue={product.stock || 100}
                    className="w-24 h-8"
                    onBlur={(e) => updateProduct({ 
                      productId: product._id, 
                      stock: parseInt(e.target.value) 
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FinancialManagement() {
  const pendingCommissions = useQuery(api.admin.getPendingCommissions);
  const processCommission = useMutation(api.admin.processCommission);

  const handleProcess = async (id: Id<"commissions">, action: "approve" | "reject") => {
    try {
      await processCommission({ commissionId: id, action });
      toast.success(`Commission ${action}d`);
    } catch (error) {
      toast.error("Failed to process commission");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Center</h2>
      <Card>
        <CardHeader>
          <CardTitle>Pending Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingCommissions?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No pending commissions</div>
          ) : (
            <div className="space-y-4">
              {pendingCommissions?.map((commission) => (
                <div key={commission._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-bold">${commission.amount.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      Tier: {commission.tier} | Rate: {(commission.percentage * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleProcess(commission._id, "reject")}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleProcess(commission._id, "approve")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CMSManagement() {
  const [heroText, setHeroText] = useState("");
  const updateCMS = useMutation(api.admin.updateCMSContent);

  const handleSave = async () => {
    try {
      await updateCMS({
        section: "hero",
        content: { headline: heroText }
      });
      toast.success("CMS updated");
    } catch (error) {
      toast.error("Failed to update CMS");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Content Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Headline Text</label>
            <Input 
              placeholder="Experience Clarity & Focus" 
              value={heroText}
              onChange={(e) => setHeroText(e.target.value)}
            />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}