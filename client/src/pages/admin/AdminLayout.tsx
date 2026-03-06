import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Ticket, 
  Star, 
  Mail, 
  Settings, 
  Bell, 
  LogOut,
  BarChart3,
  Image,
  FileText,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/promo-codes", icon: Ticket, label: "Promo Codes" },
  { href: "/admin/reviews", icon: Star, label: "Reviews" },
  { href: "/admin/newsletter", icon: Mail, label: "Newsletter" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  { href: "/admin/content", icon: Image, label: "Content" },
  { href: "/admin/email-templates", icon: FileText, label: "Email Templates" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery({
    queryKey: ["/api/admin/session"],
    refetchInterval: 60000,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/admin/notifications", { unread: true }],
    enabled: !!session?.authenticated,
    refetchInterval: 30000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      setLocation("/admin");
    },
  });

  useEffect(() => {
    if (!isLoading && !session?.authenticated && location !== "/admin") {
      setLocation("/admin");
    }
  }, [session, isLoading, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session?.authenticated) {
    return null;
  }

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead).length : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/10 transform transition-transform duration-200 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin/dashboard">
              <span className="text-[#C5A059] font-serif text-xl cursor-pointer">Attaie Admin</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href || location.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                      isActive 
                        ? "bg-[#C5A059]/20 text-[#C5A059]" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-black font-bold text-sm">
                {session.user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{session.user?.username}</p>
                <p className="text-white/40 text-xs capitalize">{session.user?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-white/70 hover:text-white"
              onClick={() => logoutMutation.mutate()}
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <Link href="/admin/notifications">
                <button className="relative text-white/60 hover:text-white p-2" data-testid="button-admin-notifications">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </Link>
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="border-white/20 text-white/70">
                  View Store
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
