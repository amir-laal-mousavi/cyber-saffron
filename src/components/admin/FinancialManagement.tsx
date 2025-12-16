import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { XCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export function FinancialManagement() {
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
