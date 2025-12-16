import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaffronLoader } from "@/components/SaffronLoader";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  FileText, 
  Settings,
  AlertTriangle
} from "lucide-react";
import { UserManagement } from "@/components/admin/UserManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { FinancialManagement } from "@/components/admin/FinancialManagement";
import { CMSManagement } from "@/components/admin/CMSManagement";
// import { AdminLogin } from "@/components/admin/AdminLogin"; // Disabled for now

export default function AdminDashboard() {
  // const { isAuthenticated, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  // const user = useQuery(api.users.currentUser);
  
  // TEMPORARY: Always fetch stats
  const stats = useQuery(api.admin.getDashboardStats, {});

  // Separate Admin Login System - DISABLED
  // if (!isAuthenticated) {
  //   return <AdminLogin onLogin={() => signIn("password")} />;
  // }

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