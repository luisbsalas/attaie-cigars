import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Mail, Download, Trash2, Users } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

export default function AdminNewsletter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["/api/admin/newsletter"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast({ title: "Subscriber removed" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter"] });
      setDeleteDialog({ open: false, id: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove subscriber", variant: "destructive" });
    },
  });

  const filteredSubscribers = Array.isArray(subscribers)
    ? subscribers.filter((s: any) => s.email.toLowerCase().includes(search.toLowerCase()))
    : [];

  const activeCount = Array.isArray(subscribers) ? subscribers.filter((s: any) => s.isActive).length : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-white">Newsletter</h1>
            <p className="text-white/50">Manage newsletter subscribers</p>
          </div>
          <a href="/api/admin/export/newsletter" target="_blank">
            <Button variant="outline" className="border-white/20 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Total Subscribers</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(subscribers) ? subscribers.length : 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[#C5A059]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Active</p>
                  <p className="text-2xl font-bold text-[#2DD4BF]">{activeCount}</p>
                </div>
                <Mail className="w-8 h-8 text-[#2DD4BF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Unsubscribed</p>
                  <p className="text-2xl font-bold text-white/40">
                    {(Array.isArray(subscribers) ? subscribers.length : 0) - activeCount}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-white/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        <Card className="bg-[#111] border-white/10">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-white/50">Loading subscribers...</div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="p-8 text-center text-white/50">No subscribers found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Email</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Subscribed</th>
                      <th className="text-right p-4 text-white/50 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber: any) => (
                      <tr key={subscriber.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-white/40" />
                            <span className="text-white">{subscriber.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            subscriber.isActive ? "bg-green-500/20 text-green-500" : "bg-white/10 text-white/40"
                          }`}>
                            {subscriber.isActive ? "Active" : "Unsubscribed"}
                          </span>
                        </td>
                        <td className="p-4 text-white/60 text-sm">
                          {new Date(subscriber.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-500/10"
                            onClick={() => setDeleteDialog({ open: true, id: subscriber.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, id: null })}>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Remove Subscriber</DialogTitle>
            </DialogHeader>
            <p className="text-white/70">Are you sure you want to remove this subscriber?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button
                onClick={() => deleteDialog.id && deleteMutation.mutate(deleteDialog.id)}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Removing..." : "Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
