import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Download, Users, Key, Clock, Shield } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "manager" });

  const { data: settings } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  const { data: adminUsers } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: activityLogs } = useQuery({
    queryKey: ["/api/admin/activity-logs"],
  });

  const [storeSettings, setStoreSettings] = useState<Record<string, string>>({});

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      return apiRequest("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(settings),
      });
    },
    onSuccess: () => {
      toast({ title: "Settings saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return apiRequest("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Password changed successfully" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to change password", variant: "destructive" });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (user: any) => {
      return apiRequest("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(user),
      });
    },
    onSuccess: () => {
      toast({ title: "Admin user created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setNewUserDialog(false);
      setNewUser({ username: "", email: "", password: "", role: "manager" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
    },
  });

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-white">Settings</h1>
          <p className="text-white/50">Manage your store settings and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#C5A059] data-[state=active]:text-black">
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#C5A059] data-[state=active]:text-black">
              Security
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#C5A059] data-[state=active]:text-black">
              Admin Users
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#C5A059] data-[state=active]:text-black">
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="backup" className="data-[state=active]:bg-[#C5A059] data-[state=active]:text-black">
              Backup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Store Information</CardTitle>
                <CardDescription className="text-white/50">Basic store settings and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/70">Store Name</Label>
                    <Input
                      defaultValue={settings?.storeName || "Attaie Cigars"}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Contact Email</Label>
                    <Input
                      type="email"
                      defaultValue={settings?.contactEmail || ""}
                      onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Phone Number</Label>
                    <Input
                      defaultValue={settings?.phoneNumber || ""}
                      onChange={(e) => setStoreSettings({ ...storeSettings, phoneNumber: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Business Hours</Label>
                    <Input
                      defaultValue={settings?.businessHours || "Mon-Fri 9AM-6PM EST"}
                      onChange={(e) => setStoreSettings({ ...storeSettings, businessHours: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => updateSettingsMutation.mutate(storeSettings)}
                  className="bg-[#C5A059] text-black"
                  disabled={updateSettingsMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#C5A059]" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-white/50">Update your admin password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label className="text-white/70">Current Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  className="bg-[#C5A059] text-black"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-[#111] border-white/10">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#C5A059]" />
                    Admin Users
                  </CardTitle>
                  <CardDescription className="text-white/50">Manage admin access</CardDescription>
                </div>
                <Button onClick={() => setNewUserDialog(true)} className="bg-[#C5A059] text-black">
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.isArray(adminUsers) && adminUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-black font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-white/40 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          user.role === "admin" ? "bg-[#C5A059]/20 text-[#C5A059]" : "bg-white/10 text-white/60"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#C5A059]" />
                  Activity Log
                </CardTitle>
                <CardDescription className="text-white/50">Recent admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {Array.isArray(activityLogs) && activityLogs.slice(0, 50).map((log: any) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs">
                        {log.adminUsername?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">
                          <span className="text-[#C5A059]">{log.adminUsername || "System"}</span>
                          {" "}{log.action.replace(/_/g, " ")}
                        </p>
                        <p className="text-white/40 text-xs truncate">{log.details}</p>
                        <p className="text-white/30 text-xs mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#C5A059]" />
                  Backup & Export
                </CardTitle>
                <CardDescription className="text-white/50">Download your store data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="/api/admin/backup" target="_blank">
                    <Button variant="outline" className="w-full border-white/20 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Full Database Backup (JSON)
                    </Button>
                  </a>
                  <a href="/api/admin/export/orders" target="_blank">
                    <Button variant="outline" className="w-full border-white/20 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export Orders (CSV)
                    </Button>
                  </a>
                  <a href="/api/admin/export/customers" target="_blank">
                    <Button variant="outline" className="w-full border-white/20 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export Customers (CSV)
                    </Button>
                  </a>
                  <a href="/api/admin/export/products" target="_blank">
                    <Button variant="outline" className="w-full border-white/20 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export Products (CSV)
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* New User Dialog */}
        <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add Admin User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70">Username</Label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Email</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Password</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="manager">Manager (Limited)</SelectItem>
                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewUserDialog(false)} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button onClick={() => createUserMutation.mutate(newUser)} className="bg-[#C5A059] text-black" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
