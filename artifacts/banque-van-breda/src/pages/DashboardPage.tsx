import { useLocation } from "wouter";
import { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  Calendar,
  ChevronRight,
  CreditCard,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const accounts = [
  { name: "Compte courant principal", iban: "BE68 3101 2345 6789", balance: 24356.78, change: +1.2, color: "bg-[#2a7d6f]" },
  { name: "Compte épargne", iban: "BE92 3101 9876 5432", balance: 87234.50, change: +2.8, color: "bg-[#1a2744]" },
  { name: "Compte professionnel", iban: "BE45 3101 2468 1357", balance: 156780.00, change: -0.4, color: "bg-[#c4a35a]" },
];

const recentTransactions = [
  { id: 1, label: "Virement reçu - Cabinet Martens", amount: +4500, date: "Aujourd'hui, 10:23", type: "credit", category: "Virement" },
  { id: 2, label: "Assurance Ethias Protection", amount: -187.50, date: "Hier, 08:00", type: "debit", category: "Assurance" },
  { id: 3, label: "Restaurant Le Bernardin", amount: -234.00, date: "28 mars 2026", type: "debit", category: "Restaurant" },
  { id: 4, label: "Dividendes Bekaert SA", amount: +1250.00, date: "27 mars 2026", type: "credit", category: "Investissement" },
  { id: 5, label: "ONSS Trimestre 1", amount: -2340.00, date: "26 mars 2026", type: "debit", category: "Charges" },
  { id: 6, label: "Loyer Bureau Anvers", amount: -1800.00, date: "25 mars 2026", type: "debit", category: "Loyer" },
];

const portfolioData = [
  { name: "Actions", value: 145600, pct: 52, change: +3.4 },
  { name: "Obligations", value: 68400, pct: 24, change: -0.8 },
  { name: "Liquidités", value: 33800, pct: 12, change: 0 },
  { name: "Immobilier", value: 33800, pct: 12, change: +1.2 },
];

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalPortfolio = portfolioData.reduce((s, p) => s + p.value, 0);

  return (
    <DashboardLayout title={`Bonjour, ${user?.name?.split(" ")[0]}`}>
      <div className="space-y-6">
        {/* Welcome + overview */}
        <div className="bg-gradient-to-br from-[#1a2744] to-[#2a5a4a] rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-300 text-sm mb-1">Solde total de vos comptes</p>
              <div className="flex items-center gap-3">
                {balanceVisible ? (
                  <span className="text-3xl font-bold font-serif">{totalBalance.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}</span>
                ) : (
                  <span className="text-3xl font-bold">••••••</span>
                )}
                <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-gray-300 hover:text-white">
                  {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-green-300 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +2.4% ce mois
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLocation("/virements")}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                Virer
              </button>
              <button className="bg-[#2a7d6f] hover:bg-[#226660] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                <Bell className="w-4 h-4" />
                Alertes
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Portefeuille", value: totalPortfolio, icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", change: "+3.2%" },
            { label: "Épargne", value: 87234.50, icon: PiggyBank, color: "text-blue-600", bgColor: "bg-blue-50", change: "+0.8%" },
            { label: "Cartes actives", value: "3 cartes", icon: CreditCard, color: "text-purple-600", bgColor: "bg-purple-50", isText: true },
            { label: "RDV conseiller", value: "12 avr.", icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-50", isText: true },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                <div className="font-semibold text-[#1a2744] text-lg">
                  {item.isText ? item.value : (item.value as number).toLocaleString("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                </div>
                {item.change && <p className="text-green-600 text-xs mt-0.5">{item.change}</p>}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Accounts */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#1a2744] flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-[#2a7d6f]" />
                Mes comptes
              </h2>
              <button onClick={() => setLocation("/comptes")} className="text-[#2a7d6f] text-sm hover:underline flex items-center gap-1">
                Voir tout <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {accounts.map((account) => (
                <div key={account.iban} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setLocation("/comptes")}>
                  <div className={`w-2 h-10 rounded-full ${account.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[#1a2744]">{account.name}</div>
                    <div className="text-gray-400 text-xs font-mono mt-0.5">{account.iban}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-[#1a2744]">
                      {balanceVisible
                        ? account.balance.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })
                        : "••••"}
                    </div>
                    <div className={`text-xs flex items-center justify-end gap-0.5 ${account.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {account.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(account.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#1a2744] flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-[#2a7d6f]" />
                Portefeuille
              </h2>
              <button onClick={() => setLocation("/investissements")} className="text-[#2a7d6f] text-sm hover:underline flex items-center gap-1">
                Détail <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-5">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold font-serif text-[#1a2744]">
                  {totalPortfolio.toLocaleString("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                </div>
                <div className="text-green-600 text-sm flex items-center justify-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +3.2% ce mois
                </div>
              </div>
              {/* Simple bar chart */}
              <div className="space-y-3">
                {portfolioData.map((item, i) => {
                  const colors = ["bg-[#2a7d6f]", "bg-[#1a2744]", "bg-[#c4a35a]", "bg-[#2a5a7d]"];
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{item.name}</span>
                        <span className={item.change >= 0 ? "text-green-600" : "text-red-500"}>
                          {item.change > 0 ? "+" : ""}{item.change}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[i]} rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.pct}% — {(item.value).toLocaleString("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-[#1a2744]">Dernières transactions</h2>
            <button onClick={() => setLocation("/comptes")} className="text-[#2a7d6f] text-sm hover:underline flex items-center gap-1">
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                  {tx.type === "credit"
                    ? <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    : <ArrowUpRight className="w-4 h-4 text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#1a2744] truncate">{tx.label}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-400 text-xs">{tx.date}</span>
                    <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded">{tx.category}</span>
                  </div>
                </div>
                <div className={`font-semibold text-sm shrink-0 ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
