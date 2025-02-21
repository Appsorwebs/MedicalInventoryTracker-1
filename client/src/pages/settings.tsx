import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import NavSidebar from "@/components/nav-sidebar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateNotificationsMutation = useMutation({
    mutationFn: async (emailNotifications: boolean) => {
      const res = await apiRequest("PATCH", "/api/user/notifications", { emailNotifications });
      return res.json() as Promise<User>;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNotificationToggle = async (enabled: boolean) => {
    setIsUpdating(true);
    try {
      await updateNotificationsMutation.mutateAsync(enabled);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-4 sm:p-8 overflow-auto mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts when drugs are approaching their expiration date
                  </p>
                </div>
                <div className="flex items-center">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Switch
                    checked={user?.emailNotifications}
                    onCheckedChange={handleNotificationToggle}
                    disabled={isUpdating}
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Notifications will be sent to: {user?.email}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
