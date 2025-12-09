import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: Array<{
    productId: string;
    product: {
      _id: Id<"products">;
      name: string;
      priceUsd: number;
      priceEth: number;
    } | null;
    quantity: number;
    variant: string;
  }>;
  totalEth: number;
  totalUsd: number;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  cartItems,
  totalEth,
  totalUsd,
}: CheckoutDialogProps) {
  const { address, isConnected } = useAccount();
  const { sendTransaction, data: hash, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const createOrder = useMutation(api.orders.create);
  const clearCart = useMutation(api.cart.clear);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // Send ETH transaction to a designated wallet (replace with your actual wallet address)
      const MERCHANT_WALLET = "0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a"; // Replace with actual merchant wallet
      
      sendTransaction(
        {
          to: MERCHANT_WALLET as `0x${string}`,
          value: parseEther(totalEth.toString()),
        },
        {
          onSuccess: async (txHash) => {
            toast.success("Payment sent! Waiting for confirmation...");
            
            // Wait a moment for transaction to be mined
            setTimeout(async () => {
              try {
                // Create order in database
                const orderItems = cartItems
                  .filter((item) => item.product)
                  .map((item) => {
                    const multiplier = item.variant === "10g" ? 10 : item.variant === "5g" ? 5 : 1;
                    return {
                      productId: item.product!._id,
                      productName: item.product!.name,
                      quantity: item.quantity,
                      variant: item.variant,
                      priceUsd: item.product!.priceUsd * multiplier,
                      priceEth: item.product!.priceEth * multiplier,
                    };
                  });

                await createOrder({
                  items: orderItems,
                  totalUsd,
                  totalEth,
                  shippingAddress: shippingInfo,
                  transactionHash: txHash,
                });

                // Clear cart
                await clearCart();

                setStep("success");
                toast.success("Order created successfully!");
              } catch (error) {
                console.error("Error creating order:", error);
                toast.error("Payment sent but failed to create order. Please contact support.");
              }
            }, 3000);
          },
          onError: (error) => {
            console.error("Transaction error:", error);
            toast.error("Payment failed. Please try again.");
          },
        }
      );
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment");
    }
  };

  const handleClose = () => {
    if (step === "success") {
      setStep("shipping");
      setShippingInfo({
        name: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "shipping" && (
          <>
            <DialogHeader>
              <DialogTitle>Shipping Information</DialogTitle>
              <DialogDescription>
                Enter your shipping details to complete the order
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleShippingSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={shippingInfo.name}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, address: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shippingInfo.country}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, country: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Continue to Payment
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Review your order and pay with your connected wallet
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${totalUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total in ETH</span>
                  <span className="font-mono font-semibold">{totalEth.toFixed(4)} ETH</span>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                <p className="text-sm font-medium">Shipping to:</p>
                <p className="text-sm text-muted-foreground">{shippingInfo.name}</p>
                <p className="text-sm text-muted-foreground">{shippingInfo.address}</p>
                <p className="text-sm text-muted-foreground">
                  {shippingInfo.city}, {shippingInfo.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{shippingInfo.country}</p>
              </div>
              {!isConnected && (
                <p className="text-sm text-destructive">
                  Please connect your wallet to complete payment
                </p>
              )}
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-col">
              <Button
                onClick={handlePayment}
                disabled={!isConnected || isSending || isConfirming}
                className="w-full"
              >
                {isSending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSending ? "Sending..." : "Confirming..."}
                  </>
                ) : (
                  `Pay ${totalEth.toFixed(4)} ETH`
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep("shipping")}
                disabled={isSending || isConfirming}
                className="w-full"
              >
                Back to Shipping
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center">Order Confirmed!</DialogTitle>
              <DialogDescription className="text-center">
                Your payment has been processed and your order is confirmed
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  You will receive a confirmation email shortly with your order details and
                  tracking information.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Continue Shopping
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
