import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Truck, Package, Check, X, Clock, Filter, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

interface ShippingRate {
  carrier: string;
  serviceCode: string;
  serviceName: string;
  price: number;
  deliveryDays?: number;
  estimatedDelivery?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  processing: "bg-blue-500/20 text-blue-500",
  shipped: "bg-purple-500/20 text-purple-500",
  delivered: "bg-green-500/20 text-green-500",
  cancelled: "bg-red-500/20 text-red-500",
};

export default function AdminOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [shippingDialog, setShippingDialog] = useState<{ open: boolean; orderId: number | null }>({ open: false, orderId: null });
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
  });

  const { data: shippingRates, isLoading: ratesLoading } = useQuery({
    queryKey: ["/api/admin/shipping/rates", shippingDialog.orderId],
    queryFn: async () => {
      if (!shippingDialog.orderId) return null;
      const res = await fetch(`/api/admin/shipping/rates/${shippingDialog.orderId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to get rates");
      return res.json();
    },
    enabled: !!shippingDialog.orderId,
  });

  const createLabelMutation = useMutation({
    mutationFn: async ({ orderId, carrier, serviceCode }: { orderId: number; carrier: string; serviceCode: string }) => {
      const res = await fetch("/api/admin/shipping/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, carrier, serviceCode }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create label");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Shipment Created", 
        description: `Tracking: ${data.trackingNumber}` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      setShippingDialog({ open: false, orderId: null });
      setSelectedRate(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create shipping label", variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/admin/orders/${id}`, { status });
    },
    onSuccess: () => {
      toast({ title: "Status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
    },
  });

  const filteredOrders = Array.isArray(orders) 
    ? orders.filter((order: any) => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          order.shippingAddress?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-white">Orders</h1>
            <p className="text-white/50">Manage and fulfill customer orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
              data-testid="input-search-orders"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card className="bg-[#111] border-white/10">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-white/50">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-white/50">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Order</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Date</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Total</th>
                      <th className="text-right p-4 text-white/50 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order: any) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <p className="text-white font-medium">{order.orderNumber}</p>
                          <p className="text-white/40 text-xs">{order.shippingCity}, {order.shippingState}</p>
                        </td>
                        <td className="p-4 text-white/70 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateStatusMutation.mutate({ id: order.id, status: value })}
                          >
                            <SelectTrigger className={`w-[130px] ${statusColors[order.status]} border-0 h-8`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-[#C5A059] font-medium">
                          ${Number(order.total).toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {(order.status === "pending" || order.status === "processing") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[#C5A059]"
                                onClick={() => setShippingDialog({ open: true, orderId: order.id })}
                                data-testid={`button-ship-order-${order.id}`}
                              >
                                <Truck className="w-4 h-4 mr-1" />
                                Ship
                              </Button>
                            )}
                            {order.trackingNumber && (
                              <span className="text-xs text-white/50 ml-2">
                                {order.trackingNumber}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Rates Dialog */}
        <Dialog open={shippingDialog.open} onOpenChange={(open) => {
          setShippingDialog({ open, orderId: open ? shippingDialog.orderId : null });
          if (!open) setSelectedRate(null);
        }}>
          <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Shipment</DialogTitle>
              <DialogDescription className="text-white/50">
                Select a shipping method to create a label
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {ratesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#C5A059]" />
                  <span className="ml-2 text-white/60">Getting shipping rates...</span>
                </div>
              ) : shippingRates?.rates?.length > 0 ? (
                <div className="grid gap-2">
                  {shippingRates.rates.map((rate: ShippingRate, idx: number) => (
                    <button
                      key={`${rate.carrier}-${rate.serviceCode}-${idx}`}
                      onClick={() => setSelectedRate(rate)}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${
                        selectedRate?.serviceCode === rate.serviceCode && selectedRate?.carrier === rate.carrier
                          ? "border-[#C5A059] bg-[#C5A059]/10"
                          : "border-white/10 hover:border-white/30 bg-white/5"
                      }`}
                      data-testid={`rate-${rate.carrier}-${rate.serviceCode}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              rate.carrier === "usps" 
                                ? "bg-blue-500/20 text-blue-400" 
                                : "bg-amber-500/20 text-amber-400"
                            }`}>
                              {rate.carrier.toUpperCase()}
                            </span>
                            <span className="text-white font-medium">{rate.serviceName}</span>
                          </div>
                          {rate.deliveryDays && (
                            <p className="text-white/50 text-sm mt-1">
                              {rate.deliveryDays} business day{rate.deliveryDays > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <span className="text-[#C5A059] font-bold text-lg">
                          ${rate.price.toFixed(2)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/50">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No shipping rates available</p>
                  <p className="text-sm mt-1">Check carrier API configuration</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShippingDialog({ open: false, orderId: null });
                  setSelectedRate(null);
                }}
                className="border-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (shippingDialog.orderId && selectedRate) {
                    createLabelMutation.mutate({
                      orderId: shippingDialog.orderId,
                      carrier: selectedRate.carrier,
                      serviceCode: selectedRate.serviceCode,
                    });
                  }
                }}
                className="bg-[#C5A059] text-black"
                disabled={!selectedRate || createLabelMutation.isPending}
                data-testid="button-create-label"
              >
                {createLabelMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Label...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-2" />
                    Create Shipping Label
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
