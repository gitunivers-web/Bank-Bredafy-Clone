import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, CheckCircle, Clock, ChevronDown } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  fromAccount: z.string().min(1, "Sélectionnez un compte"),
  toIban: z.string().min(15, "IBAN invalide"),
  beneficiaryName: z.string().min(2, "Nom requis"),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Montant invalide"),
  communication: z.string().optional(),
  executionDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

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

export default function TransfersPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [formData, setFormData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fromAccount: "", toIban: "", beneficiaryName: "", amount: "", communication: "", executionDate: "" },
  });

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSuccess(true);
    toast({ title: "Virement effectué", description: `${Number(formData?.amount).toLocaleString("fr-BE", { style: "currency", currency: "EUR" })} viré vers ${formData?.beneficiaryName}` });
    setTimeout(() => { setSuccess(false); setStep("form"); form.reset(); }, 3000);
  };

  return (
    <DashboardLayout title="Virements">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2">
          {success ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1a2744] mb-2">Virement effectué !</h2>
              <p className="text-gray-500 text-sm">
                {Number(formData?.amount).toLocaleString("fr-BE", { style: "currency", currency: "EUR" })} ont été transférés vers {formData?.beneficiaryName}
              </p>
            </div>
          ) : step === "form" ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex gap-3">
                  {["Virement simple", "Virement permanent", "Virement SEPA"].map((t, i) => (
                    <button
                      key={t}
                      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                        i === 0 ? "bg-[#2a7d6f] text-white" : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* From account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Compte débiteur</label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none appearance-none bg-white"
                      data-testid="select-from-account"
                      {...form.register("fromAccount")}
                    >
                      <option value="">Choisir un compte</option>
                      <option value="be68">Compte courant — BE68 3101 2345 6789 (24 356,78 €)</option>
                      <option value="be92">Compte épargne — BE92 3101 9876 5432 (87 234,50 €)</option>
                      <option value="be45">Compte professionnel — BE45 3101 2468 1357 (156 780,00 €)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {form.formState.errors.fromAccount && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.fromAccount.message}</p>
                  )}
                </div>

                {/* Beneficiary IBAN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">IBAN du bénéficiaire</label>
                  <input
                    type="text"
                    placeholder="BE00 0000 0000 0000"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none font-mono"
                    data-testid="input-iban"
                    {...form.register("toIban")}
                  />
                  {form.formState.errors.toIban && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.toIban.message}</p>
                  )}
                  {/* Quick beneficiaries */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {savedBeneficiaries.map((b) => (
                      <button
                        key={b.iban}
                        type="button"
                        onClick={() => {
                          form.setValue("toIban", b.iban);
                          form.setValue("beneficiaryName", b.name);
                        }}
                        className="text-xs bg-gray-100 hover:bg-[#2a7d6f]/10 hover:text-[#2a7d6f] text-gray-600 px-2 py-1 rounded transition-colors"
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beneficiary name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du bénéficiaire</label>
                  <input
                    type="text"
                    placeholder="Nom complet ou dénomination"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                    data-testid="input-beneficiary-name"
                    {...form.register("beneficiaryName")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant (€)</label>
                    <input
                      type="number"
                      placeholder="0,00"
                      step="0.01"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                      data-testid="input-amount"
                      {...form.register("amount")}
                    />
                    {form.formState.errors.amount && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date d'exécution</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      {...form.register("executionDate")}
                    />
                  </div>
                </div>

                {/* Communication */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Communication (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex: Facture 2026-003 ou +++123/456/789+++"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                    {...form.register("communication")}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2a7d6f] text-white py-3 rounded-lg font-semibold hover:bg-[#226660] transition-colors flex items-center justify-center gap-2 mt-2"
                  data-testid="button-submit-transfer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Continuer
                </button>
              </form>
            </div>
          ) : (
            /* Confirmation step */
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-[#1a2744] mb-5 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#2a7d6f]" />
                Confirmer le virement
              </h2>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4 mb-5">
                {[
                  { label: "Bénéficiaire", value: formData?.beneficiaryName },
                  { label: "IBAN", value: formData?.toIban },
                  { label: "Montant", value: `${Number(formData?.amount).toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}` },
                  { label: "Communication", value: formData?.communication || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-[#1a2744]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-[#2a7d6f] text-white py-2.5 rounded-lg font-semibold hover:bg-[#226660] transition-colors"
                  data-testid="button-confirm-transfer"
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent transfers */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-[#1a2744]">Virements récents</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentTransfers.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.status === "exécuté" ? "bg-green-50" : "bg-orange-50"}`}>
                    {t.status === "exécuté"
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <Clock className="w-4 h-4 text-orange-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#1a2744] truncate">{t.to}</div>
                    <div className="text-gray-400 text-xs">{t.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-500 font-medium text-sm">
                      {t.amount.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}
                    </div>
                    <div className={`text-xs ${t.status === "exécuté" ? "text-green-600" : "text-orange-500"}`}>{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
