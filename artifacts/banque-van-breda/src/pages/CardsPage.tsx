import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CreditCard, Eye, EyeOff, Lock, Unlock, Settings, ShieldCheck, Wifi } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const cards = [
  {
    id: 1,
    name: "Visa Platinum",
    holder: "Alexandre Dubois",
    number: "4532 •••• •••• 8742",
    expiry: "09/28",
    cvv: "•••",
    type: "Visa",
    status: "active",
    limit: 10000,
    used: 3456.20,
    color: "from-[#1a2744] to-[#2a5a7d]",
    contactless: true,
    online: true,
    international: true,
  },
  {
    id: 2,
    name: "Mastercard Business",
    holder: "Alexandre Dubois",
    number: "5412 •••• •••• 3289",
    expiry: "06/27",
    cvv: "•••",
    type: "Mastercard",
    status: "active",
    limit: 25000,
    used: 8234.50,
    color: "from-[#2a7d6f] to-[#1a5a4a]",
    contactless: true,
    online: true,
    international: true,
  },
  {
    id: 3,
    name: "Visa Classic",
    holder: "Marie Dubois",
    number: "4716 •••• •••• 5543",
    expiry: "12/26",
    cvv: "•••",
    type: "Visa",
    status: "blocked",
    limit: 3000,
    used: 0,
    color: "from-gray-400 to-gray-500",
    contactless: false,
    online: false,
    international: false,
  },
];

const recentCardOps = [
  { id: 1, card: "Visa Platinum ••8742", label: "Amazon.be", amount: -89.99, date: "30/03/2026", flag: "🇧🇪" },
  { id: 2, card: "Mastercard ••3289", label: "Apple Store Amsterdam", amount: -1299.00, date: "28/03/2026", flag: "🇳🇱" },
  { id: 3, card: "Visa Platinum ••8742", label: "Colruyt Group", amount: -156.30, date: "27/03/2026", flag: "🇧🇪" },
  { id: 4, card: "Mastercard ••3289", label: "Restaurant The Jane", amount: -234.50, date: "25/03/2026", flag: "🇧🇪" },
];

export default function CardsPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCard, setSelectedCard] = useState(cards[0]);
  const [showDetails, setShowDetails] = useState(false);
  const [toggles, setToggles] = useState({
    contactless: true,
    online: true,
    international: true,
  });

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  useEffect(() => {
    setToggles({
      contactless: selectedCard.contactless,
      online: selectedCard.online,
      international: selectedCard.international,
    });
  }, [selectedCard]);

  if (!isAuthenticated) return null;

  const usage = (selectedCard.used / selectedCard.limit) * 100;

  return (
    <DashboardLayout title="Mes cartes">
      <div className="space-y-5">
        {/* Cards carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white text-left transition-all ${
                selectedCard.id === card.id ? "ring-2 ring-offset-2 ring-[#2a7d6f] shadow-lg scale-105" : "shadow hover:shadow-md"
              }`}
              data-testid={`card-credit-${card.id}`}
            >
              {card.status === "blocked" && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Bloquée</div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="font-serif font-semibold text-sm opacity-90">{card.name}</div>
                {card.contactless && <Wifi className="w-4 h-4 opacity-70" />}
              </div>
              <div className="mb-4">
                <div className="text-sm opacity-80 mb-1">{card.number}</div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-70">Titulaire</div>
                  <div className="text-sm font-medium">{card.holder}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-70">Expire</div>
                  <div className="text-sm font-medium">{card.expiry}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Card detail */}
          <div className="lg:col-span-2 space-y-4">
            {/* Usage */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-[#1a2744] mb-4">{selectedCard.name} — Utilisation</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Dépenses ce mois</span>
                <span className="font-medium text-[#1a2744]">
                  {selectedCard.used.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })} / {selectedCard.limit.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${usage > 80 ? "bg-red-500" : usage > 60 ? "bg-orange-500" : "bg-[#2a7d6f]"}`}
                  style={{ width: `${usage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">{usage.toFixed(0)}% du plafond utilisé</div>

              <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold font-serif text-[#1a2744]">
                    {(selectedCard.limit - selectedCard.used).toLocaleString("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-500">Disponible</div>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="text-lg font-bold font-serif text-[#1a2744]">{selectedCard.expiry}</div>
                  <div className="text-xs text-gray-500">Expiration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold font-serif text-[#1a2744]">
                    {showDetails ? "782" : "•••"}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    CVV
                    <button onClick={() => setShowDetails(!showDetails)} className="text-[#2a7d6f]">
                      {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent operations */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#1a2744]">Dernières opérations par carte</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {recentCardOps.map((op) => (
                  <div key={op.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">
                      {op.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1a2744]">{op.label}</div>
                      <div className="text-gray-400 text-xs">{op.card} • {op.date}</div>
                    </div>
                    <div className="text-red-500 font-semibold text-sm">{op.amount.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card settings */}
          <div className="space-y-4">
            {/* Security */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-[#1a2744] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2a7d6f]" /> Sécurité & Contrôles
              </h3>
              <div className="space-y-3">
                {[
                  { key: "contactless", label: "Paiement sans contact", desc: "NFC activé" },
                  { key: "online", label: "Achats en ligne", desc: "E-commerce" },
                  { key: "international", label: "Paiements internationaux", desc: "Hors Belgique" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-[#1a2744]">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setToggles((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`w-10 h-5.5 rounded-full transition-colors relative ${
                        toggles[item.key as keyof typeof toggles] ? "bg-[#2a7d6f]" : "bg-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                        toggles[item.key as keyof typeof toggles] ? "translate-x-5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-[#1a2744] mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#2a7d6f]" /> Actions
              </h3>
              <div className="space-y-2">
                {selectedCard.status === "active" ? (
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm">
                    <Lock className="w-4 h-4" /> Bloquer la carte
                  </button>
                ) : (
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors text-sm">
                    <Unlock className="w-4 h-4" /> Débloquer la carte
                  </button>
                )}
                <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors text-sm">
                  <CreditCard className="w-4 h-4" /> Commander une nouvelle carte
                </button>
                <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors text-sm">
                  <Settings className="w-4 h-4" /> Modifier le plafond
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
