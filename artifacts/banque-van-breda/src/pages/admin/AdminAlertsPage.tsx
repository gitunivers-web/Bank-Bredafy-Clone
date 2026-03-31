import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, CheckCircle, Shield, Clock, Eye, X, Bell } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const alertsData = [
  { id: 1, title: "Transaction atypique — montant élevé", client: "Jean-Pierre Noel", detail: "Virement de 89 000 € vers LU00 1234 5678 9012 (Luxembourg). Dépasse 5× la moyenne mensuelle du client.", level: "critical", status: "ouverte", time: "31/03/2026 08:30", category: "Anti-fraude" },
  { id: 2, title: "Tentative de connexion suspecte", client: "Sophie Marchand", detail: "3 tentatives de connexion depuis IP 185.220.101.45 (Roumanie) en 10 minutes.", level: "critical", status: "ouverte", time: "31/03/2026 07:55", category: "Cybersécurité" },
  { id: 3, title: "Plafond journalier approché", client: "Marie Collignon", detail: "96 % du plafond virement journalier atteint (4 800 € / 5 000 €).", level: "warning", status: "ouverte", time: "31/03/2026 06:10", category: "Limites" },
  { id: 4, title: "Document KYC expiré", client: "Françoise Dupont", detail: "La carte d'identité enregistrée a expiré le 15/02/2026. Mise à jour requise.", level: "warning", status: "ouverte", time: "30/03/2026 14:22", category: "Conformité" },
  { id: 5, title: "Connexion depuis un nouvel appareil", client: "Nicolas Lefort", detail: "Première connexion depuis iPad (iOS 18.3) — London, UK.", level: "info", status: "résolue", time: "30/03/2026 10:15", category: "Cybersécurité" },
  { id: 6, title: "Modification de données sensibles", client: "Pierre Lambert", detail: "Changement de numéro de téléphone et d'adresse e-mail le même jour.", level: "warning", status: "résolue", time: "29/03/2026 16:40", category: "Sécurité" },
  { id: 7, title: "Virement vers nouveau bénéficiaire IBAN étranger", client: "Alexandre Dubois", detail: "Premier virement vers FR76 3000 1234 5678 — 12 500 €. Bénéficiaire jamais utilisé.", level: "info", status: "résolue", time: "29/03/2026 09:00", category: "Anti-fraude" },
];

const levelConfig: Record<string, { dot: string; badge: string; label: string }> = {
  critical: { dot: "bg-red-500", badge: "bg-red-100 text-red-600", label: "Critique" },
  warning: { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700", label: "Attention" },
  info: { dot: "bg-blue-400", badge: "bg-blue-100 text-blue-600", label: "Info" },
};

export default function AdminAlertsPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState("toutes");
  const [alerts, setAlerts] = useState(alertsData);

  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  const filtered = alerts.filter(a => {
    if (filter === "toutes") return true;
    if (filter === "ouvertes") return a.status === "ouverte";
    if (filter === "résolues") return a.status === "résolue";
    return a.level === filter;
  });

  const resolve = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "résolue" } : a));

  const counts = {
    total: alerts.filter(a => a.status === "ouverte").length,
    critical: alerts.filter(a => a.level === "critical" && a.status === "ouverte").length,
    warning: alerts.filter(a => a.level === "warning" && a.status === "ouverte").length,
    info: alerts.filter(a => a.level === "info" && a.status === "ouverte").length,
  };

  return (
    <AdminLayout title="Alertes & fraudes">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Alertes ouvertes", value: counts.total, icon: Bell, color: "text-gray-700", bg: "bg-gray-50" },
          { label: "Critiques", value: counts.critical, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
          { label: "Attention", value: counts.warning, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Information", value: counts.info, icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-[#1a2744]">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap gap-2">
          {["toutes", "ouvertes", "critical", "warning", "info", "résolues"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${filter === f ? "bg-[#2a7d6f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >{f === "critical" ? "Critiques" : f === "warning" ? "Attention" : f === "info" ? "Info" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map((alert) => (
            <div key={alert.id} className={`p-5 flex gap-4 ${alert.status === "résolue" ? "opacity-50" : ""}`}>
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${levelConfig[alert.level].dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-[#1a2744] text-sm">{alert.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelConfig[alert.level].badge}`}>{levelConfig[alert.level].label}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{alert.category}</span>
                    </div>
                    <div className="text-xs text-[#2a7d6f] font-medium mb-1">Client : {alert.client}</div>
                    <div className="text-xs text-gray-500">{alert.detail}</div>
                    <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{alert.time}
                      {alert.status === "résolue" && <span className="ml-2 text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Résolue</span>}
                    </div>
                  </div>
                  {alert.status === "ouverte" && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => resolve(alert.id)}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />Résoudre
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
