import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Send, Search, MessageSquare, Clock } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const conversations = [
  {
    id: 1, client: "Alexandre Dubois", advisor: "Thomas Renard", lastMsg: "Bonjour, j'aimerais planifier un rendez-vous…", time: "09:22", unread: 2,
    messages: [
      { from: "client", text: "Bonjour Thomas, j'aimerais planifier un rendez-vous pour discuter de mon portefeuille d'investissement.", time: "09:22" },
      { from: "client", text: "Êtes-vous disponible la semaine prochaine ?", time: "09:23" },
    ],
  },
  {
    id: 2, client: "Marie Collignon", advisor: "Isabelle Fontaine", lastMsg: "Merci pour votre réponse concernant le produit…", time: "Hier",
    messages: [
      { from: "client", text: "Bonjour Isabelle, merci pour votre réponse concernant le produit d'assurance vie.", time: "Hier 16:30" },
      { from: "advisor", text: "Je vous en prie, Marie. N'hésitez pas si vous avez d'autres questions.", time: "Hier 16:45" },
    ],
  },
  {
    id: 3, client: "Jean-Pierre Noel", advisor: "Thomas Renard", lastMsg: "Je souhaite contester la retenue à la source…", time: "Mar", unread: 1,
    messages: [
      { from: "client", text: "Bonjour, je souhaite contester la retenue à la source appliquée sur mon compte épargne.", time: "Mar 11:05" },
    ],
  },
  {
    id: 4, client: "Sophie Marchand", advisor: "Marc Dewaele", lastMsg: "Voici les documents demandés pour la…", time: "Lun",
    messages: [
      { from: "advisor", text: "Voici les documents demandés pour la restructuration de votre portefeuille.", time: "Lun 14:20" },
      { from: "client", text: "Parfait, je les lirai ce soir.", time: "Lun 15:02" },
    ],
  },
];

export default function AdminMessagesPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState(conversations[0]);
  const [reply, setReply] = useState("");
  const [msgs, setMsgs] = useState(conversations.map(c => ({ ...c })));

  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  const activeMsgs = msgs.find(c => c.id === selected.id)?.messages || [];

  const send = () => {
    if (!reply.trim()) return;
    setMsgs(prev => prev.map(c => c.id === selected.id
      ? { ...c, messages: [...c.messages, { from: "advisor", text: reply, time: "À l'instant" }], lastMsg: reply, unread: 0 }
      : c
    ));
    setReply("");
  };

  return (
    <AdminLayout title="Messagerie interne">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Rechercher…" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {msgs.map((c) => (
                <button key={c.id} onClick={() => setSelected(c)}
                  className={`w-full text-left px-4 py-3.5 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors ${selected.id === c.id ? "bg-[#2a7d6f]/5 border-l-2 border-l-[#2a7d6f]" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-sm font-bold shrink-0">{c.client.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-[#1a2744] text-sm truncate">{c.client}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">{c.time}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{c.lastMsg}</div>
                    <div className="text-xs text-[#2a7d6f] mt-0.5">Conseiller : {c.advisor}</div>
                  </div>
                  {c.unread ? <div className="w-4 h-4 rounded-full bg-[#2a7d6f] text-white text-xs flex items-center justify-center shrink-0 mt-1">{c.unread}</div> : null}
                </button>
              ))}
            </div>
          </div>

          {/* Message thread */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1a2744] flex items-center justify-center text-white font-bold">{selected.client.charAt(0)}</div>
              <div>
                <div className="font-semibold text-[#1a2744] text-sm">{selected.client}</div>
                <div className="text-xs text-gray-400">Conseiller attitré : {selected.advisor}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {activeMsgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "advisor" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "advisor" ? "bg-[#2a7d6f] text-white rounded-br-sm" : "bg-gray-100 text-[#1a2744] rounded-bl-sm"}`}>
                    <p>{m.text}</p>
                    <div className={`text-xs mt-1 ${m.from === "advisor" ? "text-white/60" : "text-gray-400"}`}>
                      {m.from === "advisor" ? selected.advisor : selected.client} · {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
              <input
                type="text" placeholder="Répondre au client…" value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
              />
              <button onClick={send} className="bg-[#2a7d6f] text-white px-4 py-2 rounded-lg hover:bg-[#226660] transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
