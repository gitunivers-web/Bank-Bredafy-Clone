import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { FileText, Download, Search, Filter, ChevronDown, Eye, FolderOpen } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const documents = [
  { id: 1, name: "Relevé de compte — Mars 2026", type: "Relevé", date: "31/03/2026", size: "248 KB", category: "Comptes", icon: "📄" },
  { id: 2, name: "Avis de débit — ONSS Q1 2026", type: "Avis", date: "26/03/2026", size: "89 KB", category: "Comptes", icon: "📄" },
  { id: 3, name: "Rapport de portefeuille — T1 2026", type: "Rapport", date: "31/03/2026", size: "1.2 MB", category: "Investissements", icon: "📊" },
  { id: 4, name: "Note fiscale — Revenus mobiliers 2025", type: "Fiscal", date: "15/02/2026", size: "456 KB", category: "Fiscalité", icon: "💼" },
  { id: 5, name: "Contrat Fonds Van Breda Patrimoine", type: "Contrat", date: "05/01/2026", size: "2.1 MB", category: "Investissements", icon: "📋" },
  { id: 6, name: "Relevé de compte — Février 2026", type: "Relevé", date: "28/02/2026", size: "312 KB", category: "Comptes", icon: "📄" },
  { id: 7, name: "Attestation fiscale 2025 — Épargne-pension", type: "Fiscal", date: "20/01/2026", size: "124 KB", category: "Fiscalité", icon: "💼" },
  { id: 8, name: "Avenant assurance vie Protect+", type: "Assurance", date: "10/01/2026", size: "890 KB", category: "Assurances", icon: "🛡️" },
  { id: 9, name: "Rapport annuel portefeuille 2025", type: "Rapport", date: "31/12/2025", size: "3.4 MB", category: "Investissements", icon: "📊" },
  { id: 10, name: "Relevé de compte — Janvier 2026", type: "Relevé", date: "31/01/2026", size: "287 KB", category: "Comptes", icon: "📄" },
];

const categories = ["Tous", "Comptes", "Investissements", "Fiscalité", "Assurances"];

export default function DocumentsPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [downloaded, setDownloaded] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const filtered = documents.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Tous" || d.category === category;
    return matchSearch && matchCat;
  });

  const handleDownload = (id: number) => {
    setDownloaded((prev) => [...prev, id]);
    setTimeout(() => setDownloaded((prev) => prev.filter((i) => i !== id)), 2000);
  };

  return (
    <DashboardLayout title="Mes documents">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total documents", value: documents.length.toString(), icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Ce mois", value: "4", icon: FolderOpen, color: "text-green-600", bg: "bg-green-50" },
            { label: "Fiscaux", value: "2", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Disponibles", value: "10", icon: Download, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold font-serif text-[#1a2744]">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Document list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                data-testid="input-search-documents"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    category === cat ? "bg-[#1a2744] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-testid={`filter-category-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <Filter className="w-3.5 h-3.5" /> Trier <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 px-5 py-2 border-b border-gray-50">
            <div className="col-span-6 text-xs font-medium text-gray-400">Document</div>
            <div className="col-span-2 text-xs font-medium text-gray-400">Catégorie</div>
            <div className="col-span-2 text-xs font-medium text-gray-400">Date</div>
            <div className="col-span-1 text-xs font-medium text-gray-400">Taille</div>
            <div className="col-span-1 text-xs font-medium text-gray-400 text-right">Actions</div>
          </div>

          {/* Documents */}
          <div className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucun document trouvé</p>
              </div>
            ) : (
              filtered.map((doc) => (
                <div key={doc.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="sm:col-span-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
                      {doc.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#1a2744]">{doc.name}</div>
                      <div className="text-xs text-gray-400">{doc.type}</div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{doc.category}</span>
                  </div>
                  <div className="sm:col-span-2 text-xs text-gray-500">{doc.date}</div>
                  <div className="sm:col-span-1 text-xs text-gray-400">{doc.size}</div>
                  <div className="sm:col-span-1 flex items-center justify-end gap-1">
                    <button
                      className="p-1.5 text-gray-400 hover:text-[#2a7d6f] hover:bg-[#2a7d6f]/10 rounded transition-colors"
                      title="Aperçu"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className={`p-1.5 rounded transition-colors ${
                        downloaded.includes(doc.id)
                          ? "text-green-600 bg-green-50"
                          : "text-gray-400 hover:text-[#2a7d6f] hover:bg-[#2a7d6f]/10"
                      }`}
                      title="Télécharger"
                      data-testid={`button-download-${doc.id}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
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
