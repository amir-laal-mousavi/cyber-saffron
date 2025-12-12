import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useNavigate } from "react-router";

interface OrderHistoryProps {
  orders: any;
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const navigate = useNavigate();

  return (
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
            {orders.map((order: any) => (
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
                  {order.items.map((item: any, idx: number) => (
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
  );
}
