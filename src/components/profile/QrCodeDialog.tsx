import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { toast } from "sonner";

interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode?: string;
}

export function QrCodeDialog({ open, onOpenChange, referralCode }: QrCodeDialogProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleDownloadQrCode = () => {
    if (!qrCodeRef.current) return;
    
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cyber-saffron-referral-${referralCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded successfully!");
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Referral Code QR</DialogTitle>
          <DialogDescription>
            Share this QR code for easy sign-ups
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          <div className="bg-white p-6 rounded-lg border-4 border-primary/20 shadow-lg" ref={qrCodeRef}>
            {referralCode && (
              <QRCodeCanvas
                value={`${window.location.origin}/auth?ref=${referralCode}`}
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
            Scan to join with referral code: <span className="font-mono font-bold text-primary">{referralCode}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 text-center max-w-sm">
            {`${window.location.origin}/auth?ref=${referralCode}`}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleDownloadQrCode}>
            <Download className="h-4 w-4 mr-2" />
            Download QR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
