import { useEffect } from "react";
import { useLocation } from "wouter";
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Users, ArrowLeftRight } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const monthlyData = [
  { month: "Oct 2025", clients: 1190, volume: "6 240 000", transactions: 3120 },
  { month: "Nov 2025", clients: 1205, volume: "6 890 000", transactions: 3280 },
  { month: "Déc 2025", clients: 1218, volume: "5 400 000", transactions: 2940 },
  { month: "Jan 2026", clients: 1224, volume: "7 110 000", transactions: 3510 },
  { month: "Fév 2026", clients: 1235, volume: "7 340 000", transactions: 3620 },
  { month: "Mar 2026", clients: 1248, volume: "8 742 300", transactions: 4110 },
];

const portfolioBreakdown = [
  { category: "Actions", pct: 38, amount: "142 M€", color: "bg-[#2a7d6f]" },
  { category: "Obligations", pct: 28, amount: "105 M€", color: "bg-[#1a2744]" },
  { category: "Immobilier", pct: 18, amount: "67 M€", color: "bg-[#c4a35a]" },
  { category: "Liquidités", pct: 10, amount: "37 M€", color: "bg-blue-400" },
  { category: "Alternatifs", pct: 6, amount: "22 M€", color: "bg-purple-400" },
];

const reports = [
  { title: "Rapport mensuel — Mars 2026", date: "01/04/2026", size: "1,4 Mo", type: "PDF" },
  { title: "Rapport mensuel — Février 2026", date: "01/03/2026", size: "1,2 Mo", type: "PDF" },
  { title: "Rapport trimestriel Q1 2026", date: "01/04/2026", size: "3,8 Mo", type: "PDF" },
  { title: "Analyse anti-fraude T1 2026", date: "31/03/2026", size: "892 Ko", type: "PDF" },
  { title: "Bilan conformité DSP2 — Mars 2026", date: "31/03/2026", size: "560 Ko", type: "PDF" },
];

export default function AdminReportsPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  const maxVolume = Math.max(...monthlyData.map(d => parseFloat(d.volume.replace(/ /g, ""))));

  return (
    <AdminLayout title="Rapports & analyses">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Volume mensuel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-[#1a2744]">Volume de virements mensuel</h2>
                <p className="text-xs text-gray-400 mt-0.5">6 derniers mois · En euros</p>
              </div>
              <TrendingUp className="w-5 h-5 text-[#2a7d6f]" />
            </div>
            <div className="flex items-end gap-3 h-40">
              {monthlyData.map((d) => {
                const vol = parseFloat(d.volume.replace(/ /g, ""));
                const h = Math.round((vol / maxVolume) * 100);
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-[#1a2744] font-semibold">
                      {(vol / 1000000).toFixed(1)}M
                    </div>
                    <div
                      className="w-full rounded-t-md bg-[#2a7d6f] transition-all"
                      style={{ height: `${h}%` }}
                    />
                    <div className="text-[10px] text-gray-400 text-center whitespace-nowrap">{d.month.split(" ")[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table mensuelle */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#1a2744]">Activité mensuelle détaillée</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Mois", "Nouveaux clients", "Volume viré", "Nb transactions", "Évolution"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...monthlyData].reverse().map((d, i, arr) => {
                    const prev = arr[i + 1];
                    const vol = parseFloat(d.volume.replace(/ /g, ""));
                    const prevVol = prev ? parseFloat(prev.volume.replace(/ /g, "")) : vol;
                    const delta = ((vol - prevVol) / prevVol * 100).toFixed(1);
                    const up = vol >= prevVol;
                    return (
                      <tr key={d.month} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-[#1a2744]">{d.month}</td>
                        <td className="px-4 py-3 text-gray-600">{d.clients}</td>
                        <td className="px-4 py-3 font-semibold text-[#1a2744]">{d.volume} €</td>
                        <td className="px-4 py-3 text-gray-600">{d.transactions.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {prev && (
                            <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
                              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {up ? "+" : ""}{delta} %
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Portfolio */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-[#1a2744] mb-4">Allocation patrimoniale globale</h2>
            <div className="flex rounded-full overflow-hidden h-4 mb-4">
              {portfolioBreakdown.map((p) => (
                <div key={p.category} className={`${p.color}`} style={{ width: `${p.pct}%` }} title={`${p.category} ${p.pct}%`} />
              ))}
            </div>
            <div className="space-y-2">
              {portfolioBreakdown.map((p) => (
                <div key={p.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                    <span className="text-gray-600">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{p.pct} %</span>
                    <span className="font-semibold text-[#1a2744] text-xs">{p.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports download */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#1a2744]">Rapports disponibles</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {reports.map((r) => (
                <div key={r.title} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#1a2744] truncate">{r.title}</div>
                    <div className="text-xs text-gray-400">{r.date} · {r.size}</div>
                  </div>
                  <button className="text-[#2a7d6f] hover:text-[#226660] p-1.5 rounded hover:bg-[#2a7d6f]/5 shrink-0 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
