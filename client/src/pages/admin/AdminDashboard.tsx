import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Calendar
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<7 | 14 | 30>(30);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["/api/admin/orders"],
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["/api/admin/products/low-stock"],
  });

  const { data: revenueTrends } = useQuery({
    queryKey: ["/api/admin/dashboard/revenue-trends", dateRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/dashboard/revenue-trends?days=${dateRange}`);
      if (!res.ok) throw new Error("Failed to fetch revenue trends");
      return res.json();
    },
  });

  const { data: topProducts } = useQuery({
    queryKey: ["/api/admin/dashboard/top-products"],
  });

  const pendingOrders = Array.isArray(recentOrders) 
    ? recentOrders.filter((o: any) => o.status === "pending" || o.status === "processing").slice(0, 5)
    : [];

  const chartData = Array.isArray(revenueTrends) ? revenueTrends.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: d.revenue,
    orders: d.orders,
  })) : [];

  const topProductsData = Array.isArray(topProducts) ? topProducts : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-white mb-2">Dashboard</h1>
          <p className="text-white/50">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ${statsLoading ? "..." : (stats?.totalRevenue || 0).toLocaleString()}
                  </p>
                  <p className="text-[#2DD4BF] text-xs mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    All time
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#C5A059]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {statsLoading ? "..." : stats?.totalOrders || 0}
                  </p>
                  <p className="text-[#E8736F] text-xs mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stats?.pendingOrders || 0} pending
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#2DD4BF]/20 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-[#2DD4BF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Customers</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {statsLoading ? "..." : stats?.totalCustomers || 0}
                  </p>
                  <p className="text-white/40 text-xs mt-1">Registered users</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#B8A9C9]/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#B8A9C9]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">Low Stock</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {statsLoading ? "..." : stats?.lowStockCount || 0}
                  </p>
                  <p className="text-[#E8736F] text-xs mt-1">Products need restock</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#E8736F]/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#E8736F]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <p className="text-white/50 text-sm">Today's Revenue</p>
              <p className="text-xl font-bold text-[#C5A059] mt-1">
                ${statsLoading ? "..." : (stats?.todayRevenue || 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <p className="text-white/50 text-sm">This Week</p>
              <p className="text-xl font-bold text-[#2DD4BF] mt-1">
                ${statsLoading ? "..." : (stats?.weekRevenue || 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-6">
              <p className="text-white/50 text-sm">This Month</p>
              <p className="text-xl font-bold text-[#B8A9C9] mt-1">
                ${statsLoading ? "..." : (stats?.monthRevenue || 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends Chart */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2DD4BF]" />
              Revenue Trends
            </CardTitle>
            <div className="flex gap-2">
              {[7, 14, 30].map((days) => (
                <Button
                  key={days}
                  variant={dateRange === days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange(days as 7 | 14 | 30)}
                  className={dateRange === days ? "bg-[#C5A059] text-black" : "border-white/20 text-white"}
                  data-testid={`button-range-${days}`}
                >
                  {days}D
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666" 
                      tick={{ fill: '#888', fontSize: 12 }}
                      interval={Math.floor(chartData.length / 6)}
                    />
                    <YAxis 
                      stroke="#666" 
                      tick={{ fill: '#888', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'revenue' ? `$${value.toFixed(2)}` : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#C5A059" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: '#C5A059' }}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#2DD4BF" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: '#2DD4BF' }}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-white/40">
                  No revenue data available for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products Chart */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {topProductsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      type="number" 
                      stroke="#666" 
                      tick={{ fill: '#888', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="#666" 
                      tick={{ fill: '#888', fontSize: 11 }}
                      width={90}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#C5A059" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-white/40">
                  No sales data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders and Low Stock Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="bg-[#111] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-white text-lg">Pending Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="text-[#C5A059]">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <p className="text-white/40 text-center py-8">No pending orders</p>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map((order: any) => (
                    <Link key={order.id} href={`/admin/orders/${order.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div>
                          <p className="text-white text-sm font-medium">{order.orderNumber}</p>
                          <p className="text-white/40 text-xs">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#C5A059] font-medium">${Number(order.total).toFixed(2)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            order.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="bg-[#111] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E8736F]" />
                Low Stock Alert
              </CardTitle>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="text-[#C5A059]">
                  Manage <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!Array.isArray(lowStockProducts) || lowStockProducts.length === 0 ? (
                <p className="text-white/40 text-center py-8">All products are well stocked</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white/10 overflow-hidden">
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-white/40 text-xs">{product.format}</p>
                        </div>
                      </div>
                      <span className="text-[#E8736F] font-bold text-sm">
                        {product.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/products">
                <Button className="bg-[#C5A059] text-black hover:bg-[#C5A059]/90">
                  <Package className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              <Link href="/admin/promo-codes">
                <Button variant="outline" className="border-white/20 text-white">
                  Create Promo Code
                </Button>
              </Link>
              <Link href="/admin/content">
                <Button variant="outline" className="border-white/20 text-white">
                  Edit Banners
                </Button>
              </Link>
              <Link href="/api/admin/export/orders" target="_blank">
                <Button variant="outline" className="border-white/20 text-white">
                  Export Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
