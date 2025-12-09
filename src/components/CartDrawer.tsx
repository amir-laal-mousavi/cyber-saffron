import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const cart = useQuery(api.cart.get);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeItem = useMutation(api.cart.removeItem);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId: string, variant: string, newQuantity: number) => {
    try {
      await updateQuantity({ productId: productId as any, variant, quantity: newQuantity });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId: string, variant: string) => {
    try {
      await removeItem({ productId: productId as any, variant });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const subtotal = cart?.items.reduce((sum, item) => {
    if (!item.product) return sum;
    const multiplier = item.variant === "10g" ? 10 : item.variant === "5g" ? 5 : 1;
    return sum + item.product.priceUsd * multiplier * item.quantity;
  }, 0) || 0;

  const estimatedTax = subtotal * 0.1;
  const total = subtotal + estimatedTax;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cart?.items.length || 0})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-6">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add some premium saffron to get started
              </p>
              <Button onClick={() => { onOpenChange(false); navigate("/"); }}>
                Return to Shop
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => {
                if (!item.product) return null;
                const multiplier = item.variant === "10g" ? 10 : item.variant === "5g" ? 5 : 1;
                const itemPrice = item.product.priceUsd * multiplier;

                return (
                  <div
                    key={`${item.productId}-${item.variant}`}
                    className="flex gap-4 p-4 border border-border rounded-lg"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                      <p className="font-mono text-sm font-semibold mt-1">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.variant, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-mono w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.variant, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveItem(item.productId, item.variant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <SheetFooter className="flex-col gap-4 border-t pt-4">
            <div className="space-y-2 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span className="font-mono">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => {
                toast.info("Checkout coming soon!");
              }}
            >
              Proceed to Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
