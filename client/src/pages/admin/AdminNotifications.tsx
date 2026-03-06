import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, ShoppingCart, Package, AlertTriangle, Info, CheckCheck } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

const typeIcons: Record<string, any> = {
  order: ShoppingCart,
  low_stock: Package,
  alert: AlertTriangle,
  info: Info,
};

const typeColors: Record<string, string> = {
  order: "text-[#2DD4BF]",
  low_stock: "text-[#E8736F]",
  alert: "text-yellow-500",
  info: "text-[#B8A9C9]",
};

export default function AdminNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/admin/notifications"],
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/notifications/${id}/read`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/admin/notifications/read-all", { method: "POST" });
    },
    onSuccess: () => {
      toast({ title: "All notifications marked as read" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
    },
  });

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead).length : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-white">Notifications</h1>
            <p className="text-white/50">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllReadMutation.mutate()}
              variant="outline"
              className="border-white/20 text-white"
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-white/50">Loading notifications...</div>
        ) : !Array.isArray(notifications) || notifications.length === 0 ? (
          <Card className="bg-[#111] border-white/10">
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No notifications</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification: any) => {
              const Icon = typeIcons[notification.type] || Bell;
              const colorClass = typeColors[notification.type] || "text-white/60";

              return (
                <Card
                  key={notification.id}
                  className={`bg-[#111] border-white/10 ${!notification.isRead ? "border-l-2 border-l-[#C5A059]" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className={`font-medium ${notification.isRead ? "text-white/70" : "text-white"}`}>
                              {notification.title}
                            </p>
                            <p className="text-white/50 text-sm mt-1">{notification.message}</p>
                            <p className="text-white/30 text-xs mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[#C5A059] hover:bg-[#C5A059]/10"
                              onClick={() => markReadMutation.mutate(notification.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
