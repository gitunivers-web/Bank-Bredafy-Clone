import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Users, ArrowLeftRight, Bell, BarChart3, FileText,
  Settings, LogOut, Menu, X, Shield, ChevronRight, MessageSquare, AlertTriangle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin" },
  { icon: Users, label: "Clients", path: "/admin/clients" },
  { icon: ArrowLeftRight, label: "Transactions", path: "/admin/transactions" },
  { icon: AlertTriangle, label: "Alertes & fraudes", path: "/admin/alertes" },
  { icon: BarChart3, label: "Rapports", path: "/admin/rapports" },
  { icon: MessageSquare, label: "Messagerie interne", path: "/admin/messages" },
  { icon: FileText, label: "Journaux d'audit", path: "/admin/audit" },
  { icon: Settings, label: "Paramètres", path: "/admin/parametres" },
];

interface Props { children: ReactNode; title?: string; }

export default function AdminLayout({ children, title }: Props) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); setLocation("/connexion"); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c4a35a] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Van Breda</div>
            <div className="text-white/50 text-xs">Administration</div>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div className="px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 bg-[#c4a35a]/20 rounded-lg px-3 py-2">
          <div className="w-6 h-6 rounded-full bg-[#c4a35a] flex items-center justify-center text-white text-xs font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
            <div className="text-[#c4a35a] text-[10px]">Administrateur</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location === path || (path !== "/admin" && location.startsWith(path));
          return (
            <button
              key={path}
              onClick={() => { setLocation(path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                active
                  ? "bg-[#c4a35a] text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setLocation("/")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all text-sm mb-1"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Espace client
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f4f5f7] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1a2744] shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 bg-[#1a2744] flex flex-col h-full">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-[#1a2744] text-base leading-tight">{title}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Banque Van Breda — Interface d'administration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#c4a35a] flex items-center justify-center text-white text-sm font-bold">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
