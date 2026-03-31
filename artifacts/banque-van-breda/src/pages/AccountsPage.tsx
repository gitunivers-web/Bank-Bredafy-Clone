import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, ArrowDownLeft, Download, Filter, Search, ChevronDown, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const accounts = [
  {
    id: 1,
    name: "Compte courant principal",
    iban: "BE68 3101 2345 6789",
    bic: "NICA BE BB",
    balance: 24356.78,
    type: "Compte courant",
    color: "bg-[#2a7d6f]",
    transactions: [
      { id: 1, label: "Virement reçu - Cabinet Martens", amount: +4500, date: "31/03/2026", category: "Virement", status: "complété" },
      { id: 2, label: "Assurance Ethias Protection", amount: -187.50, date: "30/03/2026", category: "Assurance", status: "complété" },
      { id: 3, label: "Restaurant Le Bernardin", amount: -234.00, date: "28/03/2026", category: "Restaurant", status: "complété" },
      { id: 4, label: "Virement entrant - ONSS", amount: +12400.00, date: "25/03/2026", category: "Revenus", status: "complété" },
      { id: 5, label: "Facture Proximus", amount: -89.99, date: "20/03/2026", category: "Télécom", status: "complété" },
    ],
  },
  {
    id: 2,
    name: "Compte épargne",
    iban: "BE92 3101 9876 5432",
    bic: "NICA BE BB",
    balance: 87234.50,
    type: "Épargne",
    color: "bg-[#1a2744]",
    transactions: [
      { id: 6, label: "Intérêts annuels 2025", amount: +1456.23, date: "01/01/2026", category: "Intérêts", status: "complété" },
      { id: 7, label: "Virement épargne automatique", amount: +2000.00, date: "01/03/2026", category: "Épargne", status: "complété" },
    ],
  },
  {
    id: 3,
    name: "Compte professionnel",
    iban: "BE45 3101 2468 1357",
    bic: "NICA BE BB",
    balance: 156780.00,
    type: "Professionnel",
    color: "bg-[#c4a35a]",
    transactions: [
      { id: 8, label: "Honoraires Dupont & Associés", amount: +8500.00, date: "28/03/2026", category: "Revenus", status: "complété" },
      { id: 9, label: "ONSS Trimestre 1", amount: -2340.00, date: "26/03/2026", category: "Charges", status: "complété" },
      { id: 10, label: "Loyer Bureau Anvers", amount: -1800.00, date: "25/03/2026", category: "Loyer", status: "complété" },
    ],
  },
];

export default function AccountsPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const filtered = selectedAccount.transactions.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Mes comptes">
      <div className="space-y-5">
        {/* Account cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccount(acc)}
              className={`text-left rounded-xl p-5 transition-all border-2 ${
                selectedAccount.id === acc.id
                  ? "border-[#2a7d6f] shadow-md bg-white"
                  : "border-transparent bg-white shadow-sm hover:shadow-md"
              }`}
              data-testid={`card-account-${acc.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{acc.type}</span>
                <div className={`w-3 h-3 rounded-full ${acc.color}`} />
              </div>
              <div className="font-semibold text-[#1a2744] text-sm mb-1">{acc.name}</div>
              <div className="text-gray-400 text-xs font-mono mb-3">{acc.iban}</div>
              <div className="text-xl font-bold font-serif text-[#1a2744]">
                {balanceVisible
                  ? acc.balance.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })
                  : "••••••"}
              </div>
            </button>
          ))}
        </div>

        {/* Account detail */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-[#1a2744]">{selectedAccount.name}</h2>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-gray-400 hover:text-gray-600">
                    {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="font-mono text-xs">{selectedAccount.iban}</span>
                  <span>•</span>
                  <span>BIC: {selectedAccount.bic}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-serif text-[#1a2744]">
                  {balanceVisible
                    ? selectedAccount.balance.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })
                    : "••••••"}
                </div>
                <div className="text-xs text-gray-500">Solde disponible</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setLocation("/virements")}
                className="bg-[#2a7d6f] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-[#226660] transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" /> Virer
              </button>
              <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                <ArrowDownLeft className="w-4 h-4" /> Recevoir
              </button>
              <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors ml-auto">
                <Download className="w-4 h-4" /> Exporter
              </button>
            </div>
          </div>

          {/* Transaction filters */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-40">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                data-testid="input-search-transactions"
              />
            </div>
            <button className="border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-50">
              <Filter className="w-3.5 h-3.5" /> Filtres
            </button>
            <button className="border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-50">
              Période <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Transactions */}
          <div className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Aucune transaction trouvée</div>
            ) : (
              filtered.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.amount > 0 ? "bg-green-50" : "bg-red-50"}`}>
                    {tx.amount > 0
                      ? <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      : <ArrowUpRight className="w-4 h-4 text-red-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#1a2744] truncate">{tx.label}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-400 text-xs">{tx.date}</span>
                      <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded">{tx.category}</span>
                      <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded">{tx.status}</span>
                    </div>
                  </div>
                  <div className={`font-semibold text-sm shrink-0 ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
