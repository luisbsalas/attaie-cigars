import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  Users,
  Star,
  Calendar
} from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function AdminReports() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/admin/orders"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/admin/products"],
  });

  const ordersByStatus = Array.isArray(orders)
    ? orders.reduce((acc: Record<string, number>, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const topProducts = Array.isArray(products)
    ? [...products]
        .sort((a: any, b: any) => (b.salesCount || 0) - (a.salesCount || 0))
        .slice(0, 5)
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-white">Reports & Analytics</h1>
          <p className="text-white/50">Overview of your store performance</p>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Today</p>
                  <p className="text-2xl font-bold text-white">
                    ${isLoading ? "..." : (stats?.todayRevenue || 0).toFixed(2)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-[#C5A059]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">This Week</p>
                  <p className="text-2xl font-bold text-[#2DD4BF]">
                    ${isLoading ? "..." : (stats?.weekRevenue || 0).toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#2DD4BF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-[#B8A9C9]">
                    ${isLoading ? "..." : (stats?.monthRevenue || 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-[#B8A9C9]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">All Time</p>
                  <p className="text-2xl font-bold text-[#E8736F]">
                    ${isLoading ? "..." : (stats?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-[#E8736F]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <Card className="bg-[#111] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#C5A059]" />
                Orders by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: "pending", label: "Pending", color: "bg-yellow-500" },
                  { status: "processing", label: "Processing", color: "bg-blue-500" },
                  { status: "shipped", label: "Shipped", color: "bg-purple-500" },
                  { status: "delivered", label: "Delivered", color: "bg-green-500" },
                  { status: "cancelled", label: "Cancelled", color: "bg-red-500" },
                ].map((item) => {
                  const count = ordersByStatus[item.status] || 0;
                  const total = Array.isArray(orders) ? orders.length : 1;
                  const percent = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{item.label}</span>
                        <span className="text-white">{count}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-[#111] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#C5A059]" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-white/40 text-center py-8">No sales data yet</p>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product: any, index: number) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <span className="text-white/30 font-bold text-lg w-6">#{index + 1}</span>
                      <div className="w-12 h-12 rounded bg-white/10 overflow-hidden flex-shrink-0">
                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{product.name}</p>
                        <p className="text-white/40 text-xs">{product.salesCount || 0} sold</p>
                      </div>
                      <span className="text-[#C5A059] font-medium">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</p>
              <p className="text-white/50 text-sm">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-[#2DD4BF] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.totalCustomers || 0}</p>
              <p className="text-white/50 text-sm">Customers</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-[#B8A9C9] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</p>
              <p className="text-white/50 text-sm">Products</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-[#E8736F] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.avgRating?.toFixed(1) || "N/A"}</p>
              <p className="text-white/50 text-sm">Avg Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
