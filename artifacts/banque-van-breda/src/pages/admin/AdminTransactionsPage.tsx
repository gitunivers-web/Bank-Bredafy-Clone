import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const allTransactions = [
  { id: "TX-88421", client: "Alexandre Dubois", iban: "BE43 3101 5432 1234", amount: "+12 500,00 €", type: "sortant", status: "validé", date: "31/03/2026 09:14", ref: "REF-482910", step: "Exécuté" },
  { id: "TX-88420", client: "Marie Collignon", iban: "BE67 0000 9876 1234", amount: "+3 200,00 €", type: "sortant", status: "en attente", date: "31/03/2026 08:55", ref: "REF-482909", step: "Digipass requis" },
  { id: "TX-88419", client: "Jean-Pierre Noel", iban: "LU00 1234 5678 9012", amount: "+89 000,00 €", type: "sortant", status: "bloqué", date: "31/03/2026 08:30", ref: "REF-482908", step: "Analyse anti-fraude" },
  { id: "TX-88418", client: "Sophie Marchand", iban: "FR76 3000 1234 5678", amount: "-5 600,00 €", type: "entrant", status: "validé", date: "30/03/2026 17:45", ref: "REF-482907", step: "Exécuté" },
  { id: "TX-88417", client: "Pierre Lambert", iban: "BE89 3101 8765 4321", amount: "+1 200,00 €", type: "sortant", status: "validé", date: "30/03/2026 16:22", ref: "REF-482906", step: "Exécuté" },
  { id: "TX-88416", client: "Nicolas Lefort", iban: "BE78 3101 2109 8765", amount: "+8 900,00 €", type: "sortant", status: "validé", date: "30/03/2026 14:10", ref: "REF-482905", step: "Exécuté" },
  { id: "TX-88415", client: "Françoise Dupont", iban: "BE43 0000 5432 9876", amount: "-22 000,00 €", type: "entrant", status: "validé", date: "29/03/2026 11:05", ref: "REF-482904", step: "Exécuté" },
  { id: "TX-88414", client: "Alexandre Dubois", iban: "BE92 1200 0876 1234", amount: "+500,00 €", type: "sortant", status: "validé", date: "28/03/2026 09:33", ref: "REF-482903", step: "Exécuté" },
];

const statusStyle: Record<string, string> = {
  validé: "bg-green-100 text-green-700",
  "en attente": "bg-amber-100 text-amber-700",
  bloqué: "bg-red-100 text-red-600",
};

const statusIcon: Record<string, JSX.Element> = {
  validé: <CheckCircle className="w-4 h-4 text-green-600" />,
  "en attente": <Clock className="w-4 h-4 text-amber-500" />,
  bloqué: <XCircle className="w-4 h-4 text-red-500" />,
};

export default function AdminTransactionsPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  const filtered = allTransactions.filter(tx => {
    const matchSearch = tx.client.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase()) || tx.ref.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "tous" || tx.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total aujourd'hui", value: "14 virements", icon: TrendingUp, color: "text-[#2a7d6f]" },
    { label: "Validés", value: allTransactions.filter(t => t.status === "validé").length.toString(), icon: CheckCircle, color: "text-green-600" },
    { label: "En attente", value: allTransactions.filter(t => t.status === "en attente").length.toString(), icon: Clock, color: "text-amber-500" },
    { label: "Bloqués", value: allTransactions.filter(t => t.status === "bloqué").length.toString(), icon: XCircle, color: "text-red-500" },
  ];

  return (
    <AdminLayout title="Transactions">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <Icon className={`w-5 h-5 shrink-0 ${color}`} />
            <div>
              <div className="text-lg font-bold text-[#1a2744]">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Référence, client, ID…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["tous", "validé", "en attente", "bloqué"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${filterStatus === s ? "bg-[#2a7d6f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >{s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {["", "Référence", "Client", "IBAN destination", "Montant", "Étape", "Statut", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {tx.type === "sortant"
                      ? <ArrowUpRight className="w-4 h-4 text-red-400" />
                      : <ArrowDownLeft className="w-4 h-4 text-green-500" />
                    }
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{tx.ref}</td>
                  <td className="px-4 py-3 font-medium text-[#1a2744] whitespace-nowrap">{tx.client}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{tx.iban}</td>
                  <td className={`px-4 py-3 font-semibold whitespace-nowrap ${tx.type === "sortant" ? "text-red-500" : "text-green-600"}`}>{tx.amount}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{tx.step}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {statusIcon[tx.status]}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[tx.status]}`}>{tx.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {tx.status === "bloqué" && (
                        <button className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 font-medium transition-colors">Débloquer</button>
                      )}
                      {tx.status === "en attente" && (
                        <button className="text-xs bg-[#2a7d6f]/10 text-[#2a7d6f] px-2 py-1 rounded hover:bg-[#2a7d6f]/20 font-medium transition-colors">Valider</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
