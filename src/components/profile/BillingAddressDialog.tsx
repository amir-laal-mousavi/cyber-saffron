import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BillingAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAddress?: {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export function BillingAddressDialog({ open, onOpenChange, initialAddress }: BillingAddressDialogProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    if (initialAddress) {
      setBillingAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleSaveBillingAddress = async () => {
    try {
      await updateProfile({ billingAddress });
      toast.success("Billing address updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update billing address");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveBillingAddress}>
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
