import { useEffect } from "react";
import { useLocation } from "wouter";
import { TrendingUp, TrendingDown, Users, ArrowLeftRight, AlertTriangle, CheckCircle, Clock, Eye, MoreHorizontal } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const kpis = [
  { label: "Clients actifs", value: "1 248", delta: "+12 ce mois", up: true, icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Volume viré (mois)", value: "8 742 300 €", delta: "+6,3 % vs N-1", up: true, icon: ArrowLeftRight, color: "bg-green-50 text-green-600" },
  { label: "Alertes ouvertes", value: "7", delta: "3 critiques", up: false, icon: AlertTriangle, color: "bg-red-50 text-red-500" },
  { label: "Taux de satisfaction", value: "97,4 %", delta: "+0,8 pts", up: true, icon: TrendingUp, color: "bg-[#2a7d6f]/10 text-[#2a7d6f]" },
];

const recentTx = [
  { id: "TX-88421", client: "Alexandre Dubois", amount: "12 500,00 €", type: "Virement sortant", status: "validé", date: "31/03/2026 09:14" },
  { id: "TX-88420", client: "Marie Collignon", amount: "3 200,00 €", type: "Virement sortant", status: "en attente", date: "31/03/2026 08:55" },
  { id: "TX-88419", client: "Jean-Pierre Noel", amount: "89 000,00 €", type: "Virement sortant", status: "bloqué", date: "31/03/2026 08:30" },
  { id: "TX-88418", client: "Sophie Marchand", amount: "5 600,00 €", type: "Virement entrant", status: "validé", date: "30/03/2026 17:45" },
  { id: "TX-88417", client: "Pierre Lambert", amount: "1 200,00 €", type: "Virement sortant", status: "validé", date: "30/03/2026 16:22" },
];

const alerts = [
  { title: "Transaction inhabituelle", detail: "Virement de 89 000 € — Jean-Pierre Noel", level: "critical", time: "Il y a 32 min" },
  { title: "Tentative de connexion suspecte", detail: "IP étrangère détectée — compte Marchand", level: "warning", time: "Il y a 1 h" },
  { title: "Plafond journalier approché", detail: "Marie Collignon — 96 % du plafond atteint", level: "info", time: "Il y a 2 h" },
];

const statusConfig: Record<string, string> = {
  validé: "bg-green-100 text-green-700",
  "en attente": "bg-amber-100 text-amber-700",
  bloqué: "bg-red-100 text-red-600",
};

export default function AdminDashboardPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <AdminLayout title="Tableau de bord administrateur">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpis.map(({ label, value, delta, up, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#1a2744] mb-0.5">{value}</div>
            <div className={`text-xs flex items-center gap-1 ${up ? "text-green-600" : "text-red-500"}`}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Transactions récentes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#1a2744]">Transactions récentes</h2>
              <button onClick={() => setLocation("/admin/transactions")} className="text-xs text-[#2a7d6f] hover:underline">Voir tout</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Référence", "Client", "Type", "Montant", "Statut", "Date"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{tx.id}</td>
                      <td className="px-4 py-3 font-medium text-[#1a2744] whitespace-nowrap">{tx.client}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{tx.type}</td>
                      <td className="px-4 py-3 font-semibold text-[#1a2744] whitespace-nowrap">{tx.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[tx.status]}`}>{tx.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Alertes */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#1a2744]">Alertes actives</h2>
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">7</span>
            </div>
            <div className="divide-y divide-gray-50">
              {alerts.map((a, i) => (
                <div key={i} className="p-4 flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.level === "critical" ? "bg-red-500" : a.level === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#1a2744]">{a.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.detail}</div>
                    <div className="text-xs text-gray-400 mt-1">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-50">
              <button onClick={() => setLocation("/admin/alertes")} className="text-xs text-[#2a7d6f] hover:underline">Gérer toutes les alertes →</button>
            </div>
          </div>

          {/* Activité rapide */}
          <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-[#1a2744] text-sm mb-3">Accès rapides</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Nouveau client", icon: Users, path: "/admin/clients" },
                { label: "Bloquer carte", icon: AlertTriangle, path: "/admin/clients" },
                { label: "Rapport mensuel", icon: TrendingUp, path: "/admin/rapports" },
                { label: "Audit log", icon: Eye, path: "/admin/audit" },
              ].map(({ label, icon: Icon, path }) => (
                <button key={label} onClick={() => setLocation(path)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-gray-50 hover:bg-[#2a7d6f]/5 hover:text-[#2a7d6f] transition-colors text-gray-600 text-xs font-medium"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
