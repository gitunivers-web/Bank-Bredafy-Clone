import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Search, Filter, Users, Eye, Lock, MoreHorizontal, CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const clients = [
  { id: "VB-2024-4892", name: "Alexandre Dubois", email: "a.dubois@cabinet-dubois.be", phone: "+32 475 12 34 56", type: "Médecin libéral", assets: "268 371 €", advisor: "Thomas Renard", status: "actif", risk: "modéré" },
  { id: "VB-2023-3201", name: "Marie Collignon", email: "m.collignon@notaire.be", phone: "+32 476 23 45 67", type: "Notaire", assets: "542 800 €", advisor: "Isabelle Fontaine", status: "actif", risk: "prudent" },
  { id: "VB-2024-4107", name: "Jean-Pierre Noel", email: "jp.noel@avocat-noel.be", phone: "+32 477 34 56 78", type: "Avocat", assets: "1 204 500 €", advisor: "Thomas Renard", status: "surveillé", risk: "dynamique" },
  { id: "VB-2022-1854", name: "Sophie Marchand", email: "s.marchand@marchand-co.be", phone: "+32 478 45 67 89", type: "Chef d'entreprise", assets: "3 456 200 €", advisor: "Marc Dewaele", status: "actif", risk: "dynamique" },
  { id: "VB-2025-5510", name: "Pierre Lambert", email: "p.lambert@lambert.be", phone: "+32 479 56 78 90", type: "Dentiste", assets: "189 400 €", advisor: "Isabelle Fontaine", status: "actif", risk: "prudent" },
  { id: "VB-2023-2990", name: "Françoise Dupont", email: "f.dupont@dupont-avocats.be", phone: "+32 470 67 89 01", type: "Avocat", assets: "712 300 €", advisor: "Marc Dewaele", status: "inactif", risk: "modéré" },
  { id: "VB-2024-4455", name: "Nicolas Lefort", email: "n.lefort@lefort-pharma.be", phone: "+32 471 78 90 12", type: "Pharmacien", assets: "421 600 €", advisor: "Thomas Renard", status: "actif", risk: "modéré" },
];

const statusStyle: Record<string, string> = {
  actif: "bg-green-100 text-green-700",
  surveillé: "bg-amber-100 text-amber-700",
  inactif: "bg-gray-100 text-gray-500",
};

const riskStyle: Record<string, string> = {
  prudent: "bg-blue-50 text-blue-600",
  modéré: "bg-teal-50 text-[#2a7d6f]",
  dynamique: "bg-purple-50 text-purple-600",
};

export default function AdminClientsPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof clients[0] | null>(null);

  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Gestion des clients">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Table */}
        <div className={selected ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" placeholder="Rechercher un client…" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-4 h-4" />
                <span>{filtered.length} client{filtered.length > 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Client", "N° client", "Type", "Actifs", "Conseiller", "Profil", "Statut", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((c) => (
                    <tr key={c.id} className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selected?.id === c.id ? "bg-[#2a7d6f]/5" : ""}`} onClick={() => setSelected(c)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-xs font-bold shrink-0">{c.name.charAt(0)}</div>
                          <span className="font-medium text-[#1a2744] whitespace-nowrap">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.id}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{c.type}</td>
                      <td className="px-4 py-3 font-semibold text-[#1a2744] whitespace-nowrap">{c.assets}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{c.advisor}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskStyle[c.risk]}`}>{c.risk}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1a2744]">Fiche client</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs">Fermer</button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-lg font-bold">{selected.name.charAt(0)}</div>
                <div>
                  <div className="font-semibold text-[#1a2744]">{selected.name}</div>
                  <div className="text-xs text-gray-500">{selected.type}</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[selected.status]}`}>{selected.status}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "N° client", value: selected.id },
                  { label: "E-mail", value: selected.email },
                  { label: "Téléphone", value: selected.phone },
                  { label: "Conseiller", value: selected.advisor },
                  { label: "Actifs gérés", value: selected.assets },
                  { label: "Profil de risque", value: selected.risk },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-[#1a2744] text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-lg py-2 font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <Eye className="w-3.5 h-3.5" />Consulter
                </button>
                <button className="flex items-center justify-center gap-1.5 text-xs bg-red-50 border border-red-200 rounded-lg py-2 font-medium text-red-600 hover:bg-red-100 transition-colors">
                  <Lock className="w-3.5 h-3.5" />Bloquer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
