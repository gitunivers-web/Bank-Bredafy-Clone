import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowLeftRight,
  FileText,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Comptes", href: "/comptes", icon: Wallet },
  { label: "Cartes", href: "/cartes", icon: CreditCard },
  { label: "Investissements", href: "/investissements", icon: TrendingUp },
  { label: "Virements", href: "/virements", icon: ArrowLeftRight },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Messages", href: "/messages", icon: MessageSquare },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2a7d6f] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">VB</span>
          </div>
          <div>
            <div className="text-white font-serif font-bold text-sm leading-tight">Banque Van Breda</div>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2a7d6f] flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-sm">
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">{user?.name}</div>
            <div className="text-gray-400 text-xs truncate">{user?.clientNumber}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#2a7d6f] text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
              data-testid={`nav-${item.href.replace("/", "")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {item.label}
              {item.label === "Messages" && (
                <span className="ml-auto bg-[#2a7d6f] text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1">
        <Link
          href="/profil"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            location === "/profil" ? "bg-[#2a7d6f] text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <User className="w-4.5 h-4.5 shrink-0" />
          Mon profil
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
          data-testid="button-logout"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-[#1a2744] flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-[#1a2744] flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {title && (
              <h1 className="text-lg font-semibold text-[#1a2744]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setLocation("/profil")}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#2a7d6f] flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name?.split(" ")[0]}</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
