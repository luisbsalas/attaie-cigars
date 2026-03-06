import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Ticket, Percent, DollarSign, Truck } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

const defaultPromo = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxUses: "",
  isActive: true,
  startsAt: "",
  expiresAt: "",
};

export default function AdminPromoCodes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialog, setEditDialog] = useState<{ open: boolean; promo: any }>({ open: false, promo: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; promoId: number | null }>({ open: false, promoId: null });

  const { data: promoCodes, isLoading } = useQuery({
    queryKey: ["/api/admin/promo-codes"],
  });

  const createMutation = useMutation({
    mutationFn: async (promo: any) => {
      return apiRequest("/api/admin/promo-codes", {
        method: "POST",
        body: JSON.stringify(promo),
      });
    },
    onSuccess: () => {
      toast({ title: "Promo code created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      setEditDialog({ open: false, promo: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create promo code", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...promo }: any) => {
      return apiRequest(`/api/admin/promo-codes/${id}`, {
        method: "PUT",
        body: JSON.stringify(promo),
      });
    },
    onSuccess: () => {
      toast({ title: "Promo code updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      setEditDialog({ open: false, promo: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update promo code", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/promo-codes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast({ title: "Promo code deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      setDeleteDialog({ open: false, promoId: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete promo code", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!editDialog.promo) return;
    const data = {
      ...editDialog.promo,
      startsAt: editDialog.promo.startsAt ? new Date(editDialog.promo.startsAt).toISOString() : null,
      expiresAt: editDialog.promo.expiresAt ? new Date(editDialog.promo.expiresAt).toISOString() : null,
    };
    if (editDialog.promo.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage": return <Percent className="w-4 h-4" />;
      case "fixed": return <DollarSign className="w-4 h-4" />;
      case "free_shipping": return <Truck className="w-4 h-4" />;
      default: return <Ticket className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-white">Promo Codes</h1>
            <p className="text-white/50">Create and manage discount codes</p>
          </div>
          <Button
            onClick={() => setEditDialog({ open: true, promo: { ...defaultPromo } })}
            className="bg-[#C5A059] text-black hover:bg-[#C5A059]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Promo Code
          </Button>
        </div>

        {/* Promo Codes List */}
        {isLoading ? (
          <div className="text-center py-8 text-white/50">Loading promo codes...</div>
        ) : !Array.isArray(promoCodes) || promoCodes.length === 0 ? (
          <Card className="bg-[#111] border-white/10">
            <CardContent className="py-12 text-center">
              <Ticket className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No promo codes yet</p>
              <p className="text-white/30 text-sm">Create your first discount code</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promoCodes.map((promo: any) => (
              <Card key={promo.id} className={`bg-[#111] border-white/10 ${!promo.isActive ? "opacity-50" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                        {getTypeIcon(promo.discountType)}
                      </div>
                      <div>
                        <p className="text-white font-mono font-bold text-lg">{promo.code}</p>
                        <p className="text-white/40 text-sm">{promo.description || "No description"}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${promo.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Discount</span>
                      <span className="text-[#C5A059] font-medium">
                        {promo.discountType === "percentage" && `${promo.discountValue}%`}
                        {promo.discountType === "fixed" && `$${Number(promo.discountValue).toFixed(2)}`}
                        {promo.discountType === "free_shipping" && "Free Shipping"}
                      </span>
                    </div>
                    {promo.minOrderAmount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Min Order</span>
                        <span className="text-white">${Number(promo.minOrderAmount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Uses</span>
                      <span className="text-white">
                        {promo.usedCount || 0}{promo.maxUses ? ` / ${promo.maxUses}` : ""}
                      </span>
                    </div>
                    {promo.expiresAt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Expires</span>
                        <span className="text-white">{new Date(promo.expiresAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white"
                      onClick={() => setEditDialog({ open: true, promo: { ...promo } })}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                      onClick={() => setDeleteDialog({ open: true, promoId: promo.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit/Create Dialog */}
        <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, promo: null })}>
          <DialogContent className="bg-[#111] border-white/10 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editDialog.promo?.id ? "Edit Promo Code" : "Create Promo Code"}</DialogTitle>
            </DialogHeader>
            {editDialog.promo && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Code</Label>
                  <Input
                    value={editDialog.promo.code}
                    onChange={(e) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, code: e.target.value.toUpperCase() } })}
                    placeholder="SUMMER20"
                    className="bg-white/5 border-white/10 text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Description</Label>
                  <Input
                    value={editDialog.promo.description || ""}
                    onChange={(e) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, description: e.target.value } })}
                    placeholder="Summer sale discount"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/70">Discount Type</Label>
                    <Select
                      value={editDialog.promo.discountType}
                      onValueChange={(value) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, discountType: value } })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="free_shipping">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Discount Value</Label>
                    <Input
                      type="number"
                      value={editDialog.promo.discountValue}
                      onChange={(e) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, discountValue: e.target.value } })}
                      placeholder={editDialog.promo.discountType === "percentage" ? "20" : "10.00"}
                      className="bg-white/5 border-white/10 text-white"
                      disabled={editDialog.promo.discountType === "free_shipping"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/70">Min Order Amount</Label>
                    <Input
                      type="number"
                      value={editDialog.promo.minOrderAmount || ""}
                      onChange={(e) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, minOrderAmount: e.target.value } })}
                      placeholder="50.00"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Max Uses</Label>
                    <Input
                      type="number"
                      value={editDialog.promo.maxUses || ""}
                      onChange={(e) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, maxUses: e.target.value ? parseInt(e.target.value) : null } })}
                      placeholder="Unlimited"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/70">Starts At</Label>
                    <Input
                      type="datetime-local"
                      value={editDialog.promo.startsAt ? editDialog.promo.startsAt.split(".")[0].slice(0, 16) : ""}
                      onChange={(e) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, startsAt: e.target.value } })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Expires At</Label>
                    <Input
                      type="datetime-local"
                      value={editDialog.promo.expiresAt ? editDialog.promo.expiresAt.split(".")[0].slice(0, 16) : ""}
                      onChange={(e) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, expiresAt: e.target.value } })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editDialog.promo.isActive}
                    onCheckedChange={(checked) => setEditDialog({ ...editDialog, promo: { ...editDialog.promo, isActive: checked } })}
                  />
                  <Label className="text-white/70">Active</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog({ open: false, promo: null })} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#C5A059] text-black" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, promoId: null })}>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Delete Promo Code</DialogTitle>
            </DialogHeader>
            <p className="text-white/70">Are you sure you want to delete this promo code? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, promoId: null })} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button
                onClick={() => deleteDialog.promoId && deleteMutation.mutate(deleteDialog.promoId)}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
