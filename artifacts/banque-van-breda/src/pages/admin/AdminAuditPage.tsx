import { useEffect } from "react";
import { useLocation } from "wouter";
import { FileText, Shield, User, ArrowLeftRight, Settings, LogIn, Download } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const logs = [
  { id: 1, type: "login", icon: LogIn, user: "Sophie Laurent (Admin)", action: "Connexion au backoffice", ip: "213.195.44.10", date: "31/03/2026 09:00:12", level: "info" },
  { id: 2, type: "tx", icon: ArrowLeftRight, user: "Alexandre Dubois (Client)", action: "Virement signé — 12 500 € vers BE43 3101 5432 1234", ip: "92.108.22.45", date: "31/03/2026 09:14:33", level: "info" },
  { id: 3, type: "security", icon: Shield, user: "Système (Anti-fraude)", action: "BLOCAGE automatique — Virement 89 000 € — Jean-Pierre Noel", ip: "—", date: "31/03/2026 08:30:55", level: "critical" },
  { id: 4, type: "login", icon: LogIn, user: "IP: 185.220.101.45 (Roumanie)", action: "Tentative de connexion échouée × 3 — Sophie Marchand", ip: "185.220.101.45", date: "31/03/2026 07:55:22", level: "warning" },
  { id: 5, type: "admin", icon: User, user: "Sophie Laurent (Admin)", action: "Consultation fiche client — Jean-Pierre Noel", ip: "213.195.44.10", date: "31/03/2026 09:32:00", level: "info" },
  { id: 6, type: "settings", icon: Settings, user: "Marc Dewaele (Conseiller)", action: "Modification plafond virement — Sophie Marchand → 20 000 €/j", ip: "91.180.55.30", date: "30/03/2026 14:10:00", level: "warning" },
  { id: 7, type: "tx", icon: ArrowLeftRight, user: "Nicolas Lefort (Client)", action: "Virement exécuté — 8 900 € vers BE78 3101 2109 8765", ip: "87.214.30.12", date: "30/03/2026 14:10:45", level: "info" },
  { id: 8, type: "login", icon: LogIn, user: "Isabelle Fontaine (Conseiller)", action: "Connexion au backoffice", ip: "91.180.55.31", date: "30/03/2026 08:30:00", level: "info" },
  { id: 9, type: "security", icon: Shield, user: "Nicolas Lefort (Client)", action: "Connexion depuis nouvel appareil — iPad iOS 18.3 — London, UK", ip: "62.212.68.90", date: "30/03/2026 10:15:33", level: "warning" },
  { id: 10, type: "admin", icon: FileText, user: "Marc Dewaele (Conseiller)", action: "Export rapport mensuel — Février 2026", ip: "91.180.55.30", date: "29/03/2026 17:00:22", level: "info" },
];

const levelStyle: Record<string, string> = {
  info: "bg-blue-50 text-blue-600",
  warning: "bg-amber-50 text-amber-600",
  critical: "bg-red-50 text-red-600",
};

const iconBg: Record<string, string> = {
  login: "bg-blue-50 text-blue-600",
  tx: "bg-green-50 text-green-600",
  security: "bg-red-50 text-red-500",
  admin: "bg-[#2a7d6f]/10 text-[#2a7d6f]",
  settings: "bg-amber-50 text-amber-600",
};

export default function AdminAuditPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <AdminLayout title="Journaux d'audit">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">Traçabilité complète de toutes les actions sensibles sur la plateforme · DSP2 / RGPD</p>
        <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 font-medium text-gray-600 transition-colors">
          <Download className="w-4 h-4" />Exporter CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["", "Utilisateur / Système", "Action enregistrée", "IP", "Niveau", "Date & heure"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => {
                const Icon = log.icon;
                return (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg[log.type]}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1a2744] whitespace-nowrap text-xs">{log.user}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">{log.action}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{log.ip}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelStyle[log.level]}`}>
                        {log.level === "info" ? "Info" : log.level === "warning" ? "Attention" : "Critique"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{log.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <span>Affichage de 10 entrées sur 4 832 enregistrements</span>
          <button className="text-[#2a7d6f] hover:underline">Charger plus</button>
        </div>
      </div>
    </AdminLayout>
  );
}
