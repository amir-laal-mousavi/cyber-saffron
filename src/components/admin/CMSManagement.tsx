import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function CMSManagement() {
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
