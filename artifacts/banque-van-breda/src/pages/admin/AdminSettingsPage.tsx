import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Settings, Shield, Bell, Users, CreditCard, Save } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

const advisors = ["Thomas Renard", "Isabelle Fontaine", "Marc Dewaele", "Céline Beaumont", "Frédéric Janssen"];

export default function AdminSettingsPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (!isAuthenticated || !isAdmin) setLocation(!isAuthenticated ? "/connexion" : "/dashboard"); }, [isAuthenticated, isAdmin]);
  if (!isAuthenticated || !isAdmin) return null;

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#2a7d6f]" />
        <h2 className="font-semibold text-[#1a2744]">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, defaultVal, type = "text" }: { label: string; defaultVal: string; type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultVal}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none" />
    </div>
  );

  const Toggle = ({ label, desc, defaultOn = false }: { label: string; desc?: string; defaultOn?: boolean }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <div className="flex items-center justify-between py-1">
        <div>
          <div className="text-sm font-medium text-gray-700">{label}</div>
          {desc && <div className="text-xs text-gray-400 mt-0.5">{desc}</div>}
        </div>
        <button onClick={() => setOn(!on)}
          className={`relative w-10 h-5 rounded-full transition-colors ${on ? "bg-[#2a7d6f]" : "bg-gray-200"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
        </button>
      </div>
    );
  };

  return (
    <AdminLayout title="Paramètres">
      <div className="grid lg:grid-cols-2 gap-5">
        <Section icon={Shield} title="Sécurité & authentification">
          <Field label="Durée de session (minutes)" defaultVal="30" type="number" />
          <Field label="Tentatives max. avant verrouillage" defaultVal="5" type="number" />
          <Field label="Plafond virement auto-bloqué (€)" defaultVal="50000" type="number" />
          <Toggle label="Authentification 2FA obligatoire" desc="Impose le 2FA à tous les utilisateurs" defaultOn={true} />
          <Toggle label="Blocage IP étrangères suspectes" desc="Alerte automatique si IP hors zone UE" defaultOn={true} />
          <Toggle label="Signature numérique obligatoire" desc="Tous virements > 1 000 € signés" defaultOn={true} />
        </Section>

        <Section icon={Bell} title="Notifications & alertes">
          <Toggle label="Alertes anti-fraude en temps réel" defaultOn={true} />
          <Toggle label="Notification e-mail admin" desc="Sur chaque alerte critique" defaultOn={true} />
          <Toggle label="Rapport quotidien automatique" defaultOn={false} />
          <Toggle label="Alerte KYC expiré" desc="30 jours avant expiration document" defaultOn={true} />
          <Field label="E-mail de réception des alertes" defaultVal="admin@vanbreda.be" type="email" />
        </Section>

        <Section icon={Users} title="Gestion des conseillers">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conseillers actifs</label>
            <div className="space-y-2">
              {advisors.map((a) => (
                <div key={a} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2a7d6f] flex items-center justify-center text-white text-xs font-bold">{a.charAt(0)}</div>
                    <span className="text-sm text-[#1a2744]">{a}</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Actif</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section icon={CreditCard} title="Limites & plafonds">
          <Field label="Plafond virement journalier (€)" defaultVal="100000" type="number" />
          <Field label="Plafond virement SEPA international (€)" defaultVal="50000" type="number" />
          <Field label="Montant seuil alerte anti-fraude (€)" defaultVal="20000" type="number" />
          <Toggle label="Virement hors UE soumis à validation admin" defaultOn={true} />
          <Toggle label="Bloquer virements nouveaux bénéficiaires > 10 000 €" defaultOn={false} />
        </Section>
      </div>

      <div className="mt-5 flex justify-end">
        <button onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${saved ? "bg-green-500 text-white" : "bg-[#2a7d6f] text-white hover:bg-[#226660]"}`}
        >
          <Save className="w-4 h-4" />
          {saved ? "Enregistré !" : "Enregistrer les modifications"}
        </button>
      </div>
    </AdminLayout>
  );
}
