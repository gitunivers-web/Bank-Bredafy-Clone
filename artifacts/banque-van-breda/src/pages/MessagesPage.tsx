import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Send, Paperclip, Search, Star, Archive, Trash2, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const conversations = [
  {
    id: 1,
    from: "Pierre Vandenberghe",
    role: "Votre conseiller Van Breda",
    avatar: "PV",
    subject: "Revue de votre portefeuille - Opportunités T2 2026",
    preview: "Bonjour M. Dubois, suite à notre dernière rencontre, je souhaitais vous présenter quelques opportunités d'investissement intéressantes pour ce second trimestre...",
    date: "Aujourd'hui, 09:15",
    read: false,
    starred: true,
    messages: [
      {
        id: 1,
        from: "Pierre Vandenberghe",
        date: "31/03/2026 — 09:15",
        text: "Bonjour M. Dubois,\n\nSuite à notre dernière rencontre du 15 mars, je souhaitais vous présenter quelques opportunités d'investissement intéressantes pour ce second trimestre 2026.\n\nNos analyses montrent que le secteur de la santé belge offre de belles perspectives, notamment avec la montée en puissance des biotech. Par ailleurs, avec la stabilisation des taux de la BCE, les obligations corporate BBB+ redeviennent attractives.\n\nJe serais disponible pour un appel téléphonique cette semaine afin d'en discuter plus en détail. Quelles sont vos disponibilités ?\n\nCordialement,\nPierre Vandenberghe\nConseiller patrimonial senior",
      },
    ],
  },
  {
    id: 2,
    from: "Service Fiscal Van Breda",
    role: "Équipe conseil fiscal",
    avatar: "SF",
    subject: "Attestations fiscales 2025 disponibles",
    preview: "Vos attestations fiscales 2025 sont désormais disponibles dans votre espace documents. Vous trouverez notamment...",
    date: "Hier",
    read: false,
    starred: false,
    messages: [
      {
        id: 1,
        from: "Service Fiscal Van Breda",
        date: "30/03/2026",
        text: "Cher client,\n\nNous avons le plaisir de vous informer que vos attestations fiscales 2025 sont désormais disponibles dans votre espace documents.\n\nVous trouverez notamment :\n• Attestation épargne-pension (code 1361)\n• Certificat revenus mobiliers\n• Relevé des intérêts payés\n\nCes documents sont indispensables pour votre déclaration fiscale 2026. Notre équipe reste à votre disposition pour toute question.\n\nCordialement,\nLe Service Fiscal Banque Van Breda",
      },
    ],
  },
  {
    id: 3,
    from: "Service Clientèle",
    role: "Support Van Breda",
    avatar: "SC",
    subject: "Confirmation de votre rendez-vous du 12 avril",
    preview: "Nous confirmons votre rendez-vous avec Pierre Vandenberghe le 12 avril 2026 à 14h00 au bureau de Bruxelles...",
    date: "28 mars",
    read: true,
    starred: false,
    messages: [
      {
        id: 1,
        from: "Service Clientèle",
        date: "28/03/2026",
        text: "Cher M. Dubois,\n\nNous confirmons votre rendez-vous :\n• Date : 12 avril 2026 à 14h00\n• Lieu : Bureau Van Breda Bruxelles, Avenue Louise 367\n• Conseiller : Pierre Vandenberghe\n• Objet : Revue annuelle de portefeuille\n\nMerci de nous prévenir 24h à l'avance en cas d'empêchement.\n\nCordialement,\nService Clientèle Banque Van Breda",
      },
    ],
  },
];

export default function MessagesPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState(conversations[0]);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleSend = () => {
    if (!reply.trim()) return;
    setSent(true);
    setReply("");
    setTimeout(() => setSent(false), 2000);
  };

  const filtered = conversations.filter((c) =>
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.from.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = conversations.filter((c) => !c.read).length;

  return (
    <DashboardLayout title="Messages">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 10rem)" }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#1a2744]">
                  Messages {unreadCount > 0 && <span className="ml-1 bg-[#2a7d6f] text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </span>
                <button className="text-[#2a7d6f] text-xs font-medium hover:underline">Nouveau</button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${selected.id === conv.id ? "bg-[#2a7d6f]/5 border-l-2 border-[#2a7d6f]" : ""}`}
                  data-testid={`conversation-${conv.id}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${!conv.read ? "bg-[#2a7d6f] text-white" : "bg-gray-100 text-gray-600"}`}>
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium truncate ${!conv.read ? "text-[#1a2744]" : "text-gray-600"}`}>{conv.from}</span>
                        <span className="text-xs text-gray-400 shrink-0 ml-1">{conv.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-medium mb-0.5 truncate ${!conv.read ? "text-[#1a2744]" : "text-gray-500"}`}>{conv.subject}</div>
                  <div className="text-xs text-gray-400 truncate">{conv.preview}</div>
                  {conv.starred && <Star className="w-3 h-3 text-[#c4a35a] mt-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Message view */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Message header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#1a2744] text-sm">{selected.subject}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-[#2a7d6f] flex items-center justify-center text-white text-xs">{selected.avatar}</div>
                  <span className="text-xs text-gray-500">{selected.from}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-400">{selected.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-[#c4a35a] hover:bg-yellow-50 rounded transition-colors">
                  <Star className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <Archive className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selected.messages.map((msg) => (
                <div key={msg.id} className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-xs">{selected.avatar}</div>
                    <div>
                      <span className="text-xs font-medium text-[#1a2744]">{msg.from}</span>
                      <span className="text-xs text-gray-400 ml-2">{msg.date}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 ml-9">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}

              {sent && (
                <div className="max-w-2xl ml-auto">
                  <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-full bg-[#2a7d6f] flex items-center justify-center text-white text-xs">AD</div>
                    <span className="text-xs text-gray-400">À l'instant</span>
                  </div>
                  <div className="bg-[#2a7d6f]/10 rounded-xl p-4 mr-9 text-right">
                    <p className="text-sm text-[#1a2744]">Votre message a été envoyé.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reply box */}
            <div className="px-5 py-3 border-t border-gray-100">
              <div className="flex gap-2 items-end">
                <div className="flex-1 border border-gray-200 rounded-xl p-3 focus-within:ring-1 focus-within:ring-[#2a7d6f] focus-within:border-transparent transition-all">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Écrire votre réponse..."
                    rows={2}
                    className="w-full text-sm text-gray-700 resize-none outline-none bg-transparent"
                    data-testid="input-reply"
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!reply.trim()}
                      className="bg-[#2a7d6f] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-[#226660] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="button-send"
                    >
                      <Send className="w-3.5 h-3.5" /> Envoyer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
