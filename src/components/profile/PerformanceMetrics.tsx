import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface PerformanceMetricsProps {
  dashboardData: any;
}

export function PerformanceMetrics({ dashboardData }: PerformanceMetricsProps) {
  return (
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
  );
}
