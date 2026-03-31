import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, CheckCircle, Clock, ChevronDown, Shield, Smartphone, CreditCard, Lock, AlertCircle, X } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const savedBeneficiaries = [
  { name: "Cabinet Médical Martens", iban: "BE89 3101 8765 4321" },
  { name: "Étude Notariale Lambert", iban: "BE43 3101 5432 1234" },
  { name: "Assurance DKV", iban: "BE78 3101 2109 8765" },
];

const recentTransfers = [
  { id: 1, to: "Cabinet Martens", amount: -2500, date: "28/03/2026", status: "exécuté" },
  { id: 2, to: "Étude Lambert", amount: -850, date: "20/03/2026", status: "exécuté" },
  { id: 3, to: "DKV Assurance", amount: -340, date: "15/03/2026", status: "exécuté" },
  { id: 4, to: "Épargne personnel", amount: -2000, date: "01/03/2026", status: "planifié" },
];

type Phase = "beneficiary" | "details" | "sms" | "digipass" | "signature" | "done";

interface TransferData {
  fromAccount: string;
  toIban: string;
  beneficiaryName: string;
  amount: string;
  communication: string;
  executionDate: string;
}

function CodeInput({ value, onChange, length = 6 }: { value: string; onChange: (v: string) => void; length?: number }) {
  return (
    <div className="flex gap-2 justify-center my-4">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => {
            const next = value.split("");
            next[i] = e.target.value.replace(/\D/, "");
            onChange(next.join("").slice(0, length));
            if (e.target.value && i < length - 1) {
              const inputs = document.querySelectorAll<HTMLInputElement>("[data-codeinput]");
              inputs[i + 1]?.focus();
            }
          }}
          data-codeinput
          className="w-10 h-12 text-center text-lg font-mono font-bold border-2 border-gray-200 rounded-lg focus:border-[#2a7d6f] focus:outline-none transition-colors bg-white"
        />
      ))}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-[#1a2744] text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function TransfersPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("beneficiary");
  const [data, setData] = useState<TransferData>({
    fromAccount: "", toIban: "", beneficiaryName: "", amount: "", communication: "", executionDate: new Date().toISOString().split("T")[0],
  });
  const [smsCode, setSmsCode] = useState("");
  const [digiCode, setDigiCode] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (!isAuthenticated) setLocation("/connexion"); }, [isAuthenticated]);
  if (!isAuthenticated) return null;

  const validate = (phase: Phase): boolean => {
    const e: Record<string, string> = {};
    if (phase === "beneficiary") {
      if (!data.fromAccount) e.fromAccount = "Sélectionnez un compte";
      if (data.toIban.length < 15) e.toIban = "IBAN invalide (min. 15 caractères)";
      if (!data.beneficiaryName.trim()) e.beneficiaryName = "Nom du bénéficiaire requis";
    }
    if (phase === "details") {
      if (!data.amount || isNaN(Number(data.amount)) || Number(data.amount) <= 0) e.amount = "Montant invalide";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async (from: Phase) => {
    if (!validate(from)) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    const map: Record<Phase, Phase> = { beneficiary: "details", details: "sms", sms: "digipass", digipass: "signature", signature: "done", done: "done" };
    setPhase(map[from]);
  };

  const finish = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setPhase("done");
    toast({ title: "Virement exécuté avec succès", description: `${Number(data.amount).toLocaleString("fr-BE", { style: "currency", currency: "EUR" })} vers ${data.beneficiaryName}` });
  };

  const reset = () => {
    setPhase("beneficiary");
    setData({ fromAccount: "", toIban: "", beneficiaryName: "", amount: "", communication: "", executionDate: new Date().toISOString().split("T")[0] });
    setSmsCode(""); setDigiCode(""); setPinCode(""); setErrors({});
  };

  const fmtAmount = () => Number(data.amount || 0).toLocaleString("fr-BE", { style: "currency", currency: "EUR" });

  return (
    <DashboardLayout title="Virements">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {/* PHASE 1 — Bénéficiaire */}
            {phase === "beneficiary" && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2a7d6f]/10 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-[#2a7d6f]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#1a2744] text-sm">Sélection du compte et du bénéficiaire</h2>
                    <p className="text-xs text-gray-400">Indiquez le compte à débiter et le destinataire du virement</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Compte débiteur</label>
                    <div className="relative">
                      <select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none appearance-none bg-white"
                        value={data.fromAccount}
                        onChange={(e) => setData({ ...data, fromAccount: e.target.value })}
                      >
                        <option value="">Choisir un compte</option>
                        <option value="be68">Compte courant — BE68 3101 2345 6789 (24 356,78 €)</option>
                        <option value="be92">Compte épargne — BE92 3101 9876 5432 (87 234,50 €)</option>
                        <option value="be45">Compte professionnel — BE45 3101 2468 1357 (156 780,00 €)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.fromAccount && <p className="text-red-500 text-xs mt-1">{errors.fromAccount}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">IBAN du bénéficiaire</label>
                    <input
                      type="text"
                      placeholder="BE00 0000 0000 0000"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none font-mono"
                      value={data.toIban}
                      onChange={(e) => setData({ ...data, toIban: e.target.value })}
                    />
                    {errors.toIban && <p className="text-red-500 text-xs mt-1">{errors.toIban}</p>}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {savedBeneficiaries.map((b) => (
                        <button key={b.iban} type="button"
                          onClick={() => setData({ ...data, toIban: b.iban, beneficiaryName: b.name })}
                          className="text-xs bg-gray-100 hover:bg-[#2a7d6f]/10 hover:text-[#2a7d6f] text-gray-600 px-2 py-1 rounded transition-colors"
                        >{b.name}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du bénéficiaire</label>
                    <input
                      type="text"
                      placeholder="Nom complet ou dénomination"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                      value={data.beneficiaryName}
                      onChange={(e) => setData({ ...data, beneficiaryName: e.target.value })}
                    />
                    {errors.beneficiaryName && <p className="text-red-500 text-xs mt-1">{errors.beneficiaryName}</p>}
                  </div>

                  <button onClick={() => next("beneficiary")} disabled={loading}
                    className="w-full bg-[#2a7d6f] text-white py-3 rounded-lg font-semibold hover:bg-[#226660] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <><ArrowUpRight className="w-4 h-4" />Continuer</>}
                  </button>
                </div>
              </>
            )}

            {/* PHASE 2 — Montant & détails */}
            {phase === "details" && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2a7d6f]/10 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-[#2a7d6f]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#1a2744] text-sm">Montant et détails du virement</h2>
                    <p className="text-xs text-gray-400">Précisez le montant, la communication et la date d'exécution</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-[#2a7d6f]/5 rounded-lg p-3 text-sm text-[#2a7d6f] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Bénéficiaire : <strong>{data.beneficiaryName}</strong> — {data.toIban}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant (€)</label>
                      <input type="number" placeholder="0,00" step="0.01"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                        value={data.amount} onChange={(e) => setData({ ...data, amount: e.target.value })}
                      />
                      {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Date d'exécution</label>
                      <input type="date"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                        value={data.executionDate} onChange={(e) => setData({ ...data, executionDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Communication (optionnel)</label>
                    <input type="text" placeholder="Ex: Facture 2026-003 ou +++123/456/789+++"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                      value={data.communication} onChange={(e) => setData({ ...data, communication: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setPhase("beneficiary")} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      Retour
                    </button>
                    <button onClick={() => next("details")} disabled={loading}
                      className="flex-1 bg-[#2a7d6f] text-white py-2.5 rounded-lg font-semibold hover:bg-[#226660] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : "Continuer"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* PHASE 3 — Code SMS */}
            {phase === "sms" && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#1a2744] text-sm">Vérification de votre identité</h2>
                    <p className="text-xs text-gray-400">Sécurisation de la session bancaire en cours</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="w-7 h-7 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 max-w-xs mx-auto">
                      Un code de vérification a été envoyé par SMS au numéro <strong>+32 •••• ••47</strong> associé à votre profil.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex gap-2 text-xs text-amber-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Motif de la vérification :</strong> Confirmation d'identité préalable à un virement de {fmtAmount()} vers {data.beneficiaryName}. Banque Van Breda ne vous demandera jamais votre code par téléphone.</span>
                  </div>

                  <CodeInput value={smsCode} onChange={setSmsCode} length={6} />

                  <p className="text-center text-xs text-gray-400 mb-5">Code valable 5 minutes · <button className="text-[#2a7d6f] underline">Renvoyer un code</button></p>

                  <div className="flex gap-3">
                    <button onClick={() => setPhase("details")} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      Retour
                    </button>
                    <button onClick={() => next("sms")} disabled={loading}
                      className="flex-1 bg-[#2a7d6f] text-white py-2.5 rounded-lg font-semibold hover:bg-[#226660] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : "Valider"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* PHASE 4 — Digipass */}
            {phase === "digipass" && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a2744]/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#1a2744]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#1a2744] text-sm">Autorisation sécurisée de la transaction</h2>
                    <p className="text-xs text-gray-400">Authentification forte par lecteur de carte (Digipass)</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-1.5">
                    <SummaryRow label="Bénéficiaire" value={data.beneficiaryName} />
                    <SummaryRow label="IBAN" value={data.toIban} />
                    <SummaryRow label="Montant" value={fmtAmount()} />
                    {data.communication && <SummaryRow label="Communication" value={data.communication} />}
                    <SummaryRow label="Date d'exécution" value={data.executionDate} />
                  </div>

                  <div className="bg-[#1a2744]/5 border border-[#1a2744]/10 rounded-lg p-3 mb-5 flex gap-2 text-xs text-[#1a2744]">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Motif de l'autorisation :</strong> Validation du virement de {fmtAmount()} vers le compte {data.toIban}. Insérez votre carte dans le lecteur Digipass, saisissez votre PIN puis entrez le code affiché.</span>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Code Digipass (8 chiffres)</label>
                  <CodeInput value={digiCode} onChange={setDigiCode} length={8} />

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setPhase("sms")} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      Retour
                    </button>
                    <button onClick={() => next("digipass")} disabled={loading}
                      className="flex-1 bg-[#1a2744] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0f1a33] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <><Shield className="w-4 h-4" />Autoriser</>}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* PHASE 5 — Signature numérique */}
            {phase === "signature" && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c4a35a]/15 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-[#c4a35a]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#1a2744] text-sm">Signature numérique du virement</h2>
                    <p className="text-xs text-gray-400">Dernière validation avant transmission à la chambre de compensation</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 rounded-full bg-[#c4a35a]/10 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-7 h-7 text-[#c4a35a]" />
                    </div>
                    <p className="text-sm font-semibold text-[#1a2744] mb-1">Signature de l'ordre de paiement</p>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Ce virement de <strong className="text-[#1a2744]">{fmtAmount()}</strong> vers <strong className="text-[#1a2744]">{data.beneficiaryName}</strong> requiert votre signature numérique personnelle. Aucune tierce partie ne peut effectuer cette action à votre place.
                    </p>
                  </div>

                  <div className="bg-[#c4a35a]/10 border border-[#c4a35a]/30 rounded-lg p-3 mb-5 flex gap-2 text-xs text-[#8b6e30]">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Motif de la signature :</strong> Engagement contractuel de votre responsabilité sur l'ordre de paiement SEPA n° REF-{Math.floor(Math.random() * 900000 + 100000)} daté du {data.executionDate}. Ce code constitue votre consentement électronique ayant valeur légale.</span>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Code PIN de signature (4 chiffres)</label>
                  <CodeInput value={pinCode} onChange={setPinCode} length={4} />

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setPhase("digipass")} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      Retour
                    </button>
                    <button onClick={finish} disabled={loading}
                      className="flex-1 bg-[#c4a35a] text-white py-2.5 rounded-lg font-semibold hover:bg-[#a8883a] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      {loading
                        ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        : <><Lock className="w-4 h-4" />Signer et transmettre</>
                      }
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* DONE */}
            {phase === "done" && (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1a2744] mb-2">Virement transmis</h2>
                <p className="text-gray-500 text-sm mb-1">
                  <strong>{fmtAmount()}</strong> ont été transférés avec succès vers
                </p>
                <p className="text-gray-700 font-semibold mb-1">{data.beneficiaryName}</p>
                <p className="text-gray-400 text-xs font-mono mb-6">{data.toIban}</p>
                <p className="text-xs text-gray-400 mb-6">
                  Référence : REF-{Math.floor(Math.random() * 900000 + 100000)} · Date d'exécution : {data.executionDate}
                </p>
                <button onClick={reset}
                  className="bg-[#2a7d6f] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#226660] transition-colors text-sm"
                >
                  Effectuer un nouveau virement
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Virements récents */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-[#1a2744]">Virements récents</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentTransfers.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.status === "exécuté" ? "bg-green-50" : "bg-orange-50"}`}>
                    {t.status === "exécuté" ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#1a2744] truncate">{t.to}</div>
                    <div className="text-gray-400 text-xs">{t.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-500 font-medium text-sm">{t.amount.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}</div>
                    <div className={`text-xs ${t.status === "exécuté" ? "text-green-600" : "text-orange-500"}`}>{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-[#1a2744]/5 border border-[#1a2744]/10 rounded-xl p-4">
            <div className="flex items-start gap-2 text-xs text-[#1a2744]/70">
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-[#2a7d6f]" />
              <span>Les virements sont protégés par une authentification multi-facteurs conforme aux exigences DSP2 et aux standards de sécurité Van Breda.</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
