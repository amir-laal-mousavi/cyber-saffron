import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export function UserManagement() {
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
