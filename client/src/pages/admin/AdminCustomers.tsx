import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Mail, Phone, MapPin, ShoppingBag, Eye } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/admin/customers"],
  });

  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((c: any) =>
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-white">Customers</h1>
          <p className="text-white/50">View and manage customer information</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
            data-testid="input-search-customers"
          />
        </div>

        <Card className="bg-[#111] border-white/10">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-white/50">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-white/50">No customers found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Customer</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Email</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Location</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Orders</th>
                      <th className="text-left p-4 text-white/50 text-sm font-medium">Total Spent</th>
                      <th className="text-right p-4 text-white/50 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer: any) => (
                      <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold">
                              {(customer.firstName?.[0] || customer.email?.[0] || "?").toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {customer.firstName} {customer.lastName}
                              </p>
                              <p className="text-white/40 text-xs">
                                Since {new Date(customer.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white/70">{customer.email}</td>
                        <td className="p-4 text-white/70">
                          {customer.city && customer.state ? `${customer.city}, ${customer.state}` : "-"}
                        </td>
                        <td className="p-4 text-white">{customer.orderCount || 0}</td>
                        <td className="p-4 text-[#C5A059] font-medium">
                          ${Number(customer.totalSpent || 0).toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/60 hover:text-white"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
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

        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold text-2xl">
                    {(selectedCustomer.firstName?.[0] || "?").toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h3>
                    <p className="text-white/50">Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/70">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedCustomer.email}</span>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{selectedCustomer.phone}</span>
                    </div>
                  )}
                  {selectedCustomer.city && (
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{selectedCustomer.city}, {selectedCustomer.state}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-white/70">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">{selectedCustomer.orderCount || 0} orders</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Total Spent</span>
                    <span className="text-2xl font-bold text-[#C5A059]">
                      ${Number(selectedCustomer.totalSpent || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
