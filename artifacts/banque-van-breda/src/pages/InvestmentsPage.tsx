import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TrendingUp, TrendingDown, Info, Plus, BarChart2, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const portfolio = {
  total: 281600,
  change: +3.2,
  changeAmount: +8710.24,
  ytd: +12.4,
  positions: [
    { id: 1, name: "Bekaert SA", ticker: "BEKB", type: "Action", quantity: 150, price: 28.45, total: 4267.50, change: +2.3, sector: "Industrie" },
    { id: 2, name: "UCB Pharma", ticker: "UCB", type: "Action", quantity: 60, price: 142.80, total: 8568.00, change: +5.1, sector: "Santé" },
    { id: 3, name: "Ageas", ticker: "AGS", type: "Action", quantity: 200, price: 45.20, total: 9040.00, change: -1.2, sector: "Finance" },
    { id: 4, name: "Aliaxis Group", ticker: "ALIAX", type: "Action", quantity: 80, price: 32.10, total: 2568.00, change: +0.8, sector: "Industrie" },
    { id: 5, name: "BNP Paribas Bonds 2030", ticker: "BNP30", type: "Obligation", quantity: 50, price: 980.00, total: 49000.00, change: -0.4, sector: "Finance" },
    { id: 6, name: "iShares MSCI World", ticker: "IWDA", type: "ETF", quantity: 250, price: 98.34, total: 24585.00, change: +4.2, sector: "Monde" },
    { id: 7, name: "Vanguard S&P 500", ticker: "VUSA", type: "ETF", quantity: 400, price: 96.50, total: 38600.00, change: +5.8, sector: "USA" },
    { id: 8, name: "Fonds Van Breda Patrimoine", ticker: "FVBP", type: "Fonds", quantity: 1200, price: 122.40, total: 146880.00, change: +2.1, sector: "Mixte" },
  ],
};

const typeColors: Record<string, string> = {
  Action: "bg-blue-100 text-blue-700",
  Obligation: "bg-purple-100 text-purple-700",
  ETF: "bg-green-100 text-green-700",
  Fonds: "bg-orange-100 text-orange-700",
};

const allocationData = [
  { name: "Actions", pct: 52, color: "bg-[#2a7d6f]" },
  { name: "Obligations", pct: 24, color: "bg-[#1a2744]" },
  { name: "ETF", pct: 12, color: "bg-[#c4a35a]" },
  { name: "Fonds", pct: 12, color: "bg-[#2a5a7d]" },
];

export default function InvestmentsPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"positions" | "ordres" | "historique">("positions");
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const filtered = filter === "Tous" ? portfolio.positions : portfolio.positions.filter((p) => p.type === filter);

  return (
    <DashboardLayout title="Mes investissements">
      <div className="space-y-5">
        {/* Portfolio overview */}
        <div className="bg-gradient-to-br from-[#1a2744] to-[#2a5a4a] rounded-xl p-6 text-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-300 text-xs mb-1">Valeur totale</p>
              <p className="text-2xl font-bold font-serif">{portfolio.total.toLocaleString("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}</p>
            </div>
            <div>
              <p className="text-gray-300 text-xs mb-1">Performance ce mois</p>
              <p className={`text-xl font-bold flex items-center gap-1 ${portfolio.change >= 0 ? "text-green-300" : "text-red-300"}`}>
                {portfolio.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                +{portfolio.change}%
              </p>
              <p className="text-gray-400 text-xs">+{portfolio.changeAmount.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}</p>
            </div>
            <div>
              <p className="text-gray-300 text-xs mb-1">Performance YTD</p>
              <p className="text-xl font-bold text-green-300">+{portfolio.ytd}%</p>
            </div>
            <div>
              <p className="text-gray-300 text-xs mb-1">Profil de risque</p>
              <p className="text-xl font-bold">Équilibré</p>
              <p className="text-gray-400 text-xs">Revu le 01/01/2026</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Positions table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-1">
                  {["positions", "ordres", "historique"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t as typeof tab)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                        tab === t ? "bg-[#2a7d6f] text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {["Tous", "Action", "Obligation", "ETF", "Fonds"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        filter === f ? "bg-[#1a2744] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {tab === "positions" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Titre</th>
                      <th className="text-right text-xs font-medium text-gray-400 px-3 py-3">Qté</th>
                      <th className="text-right text-xs font-medium text-gray-400 px-3 py-3">Prix</th>
                      <th className="text-right text-xs font-medium text-gray-400 px-3 py-3">Total</th>
                      <th className="text-right text-xs font-medium text-gray-400 px-5 py-3">Variation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((pos) => (
                      <tr key={pos.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-[#1a2744]">
                              {pos.ticker.slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#1a2744]">{pos.name}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-gray-400 text-xs">{pos.ticker}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeColors[pos.type]}`}>{pos.type}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right text-sm text-gray-600 px-3 py-3.5">{pos.quantity}</td>
                        <td className="text-right text-sm text-gray-600 px-3 py-3.5">{pos.price.toFixed(2)} €</td>
                        <td className="text-right text-sm font-medium text-[#1a2744] px-3 py-3.5">
                          {pos.total.toLocaleString("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                        </td>
                        <td className="text-right px-5 py-3.5">
                          <span className={`text-sm font-medium flex items-center justify-end gap-1 ${pos.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                            {pos.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            {pos.change > 0 ? "+" : ""}{pos.change}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "ordres" && (
              <div className="p-8 text-center text-gray-400">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Aucun ordre en cours</p>
                <button className="mt-3 bg-[#2a7d6f] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 mx-auto hover:bg-[#226660] transition-colors">
                  <Plus className="w-4 h-4" /> Passer un ordre
                </button>
              </div>
            )}

            {tab === "historique" && (
              <div className="p-8 text-center text-gray-400">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Historique des transactions disponible sur demande</p>
                <button className="mt-3 text-[#2a7d6f] text-sm font-medium flex items-center gap-1 mx-auto hover:underline">
                  Contacter mon conseiller <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Allocation */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-[#1a2744] mb-4">Répartition</h3>
              <div className="space-y-3">
                {allocationData.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium text-[#1a2744]">{item.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#2a7d6f]/5 border border-[#2a7d6f]/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#2a7d6f] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#1a2744] mb-1">Prochain rendez-vous</p>
                  <p className="text-xs text-gray-600">Revue de portefeuille avec votre conseiller Van Breda</p>
                  <p className="text-xs text-[#2a7d6f] font-semibold mt-1">12 avril 2026 à 14h00</p>
                  <button className="mt-2 text-xs text-[#2a7d6f] font-medium hover:underline flex items-center gap-0.5">
                    Confirmer le RDV <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
