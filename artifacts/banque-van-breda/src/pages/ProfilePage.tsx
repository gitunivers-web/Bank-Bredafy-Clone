import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { User, Phone, Mail, MapPin, Shield, Bell, Eye, EyeOff, LogOut, ChevronRight, Edit, Save } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Alexandre",
    lastName: "Dubois",
    email: user?.email || "a.dubois@cabinet-dubois.be",
    phone: "+32 475 123 456",
    profession: "Médecin spécialiste",
    address: "Rue de la Loi 42, 1000 Bruxelles",
    clientNumber: "VB-2024-4892",
    since: "2018",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    newsletter: true,
    operations: true,
    investments: true,
  });

  useEffect(() => {
    if (!isAuthenticated) setLocation("/connexion");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleSave = () => {
    setEditMode(false);
    toast({ title: "Profil mis à jour", description: "Vos modifications ont été enregistrées." });
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <DashboardLayout title="Mon profil">
      <div className="max-w-3xl space-y-5">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-[#1a2744] to-[#2a5a4a]" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#2a7d6f] border-4 border-white flex items-center justify-center shadow">
                <span className="text-white font-bold text-xl">AD</span>
              </div>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-[#2a7d6f] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-[#226660] transition-colors"
                      data-testid="button-save-profile"
                    >
                      <Save className="w-3.5 h-3.5" /> Enregistrer
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
                    data-testid="button-edit-profile"
                  >
                    <Edit className="w-3.5 h-3.5" /> Modifier
                  </button>
                )}
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#1a2744]">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-500 text-sm">{profile.profession}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Client vérifié</span>
                <span className="text-gray-400 text-xs">N° client: {profile.clientNumber}</span>
                <span className="text-gray-400 text-xs">Client depuis {profile.since}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#1a2744] mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#2a7d6f]" /> Informations personnelles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Prénom", key: "firstName", icon: User },
              { label: "Nom", key: "lastName", icon: User },
              { label: "E-mail", key: "email", icon: Mail },
              { label: "Téléphone", key: "phone", icon: Phone },
              { label: "Profession", key: "profession", icon: User },
              { label: "Adresse", key: "address", icon: MapPin },
            ].map(({ label, key, icon: Icon }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                  <Icon className="w-3 h-3" /> {label}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={profile[key as keyof typeof profile]}
                    onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none"
                    data-testid={`input-profile-${key}`}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-[#1a2744]">
                    {profile[key as keyof typeof profile]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#1a2744] mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2a7d6f]" /> Préférences de notifications
          </h3>
          <div className="space-y-3">
            {[
              { key: "email", label: "Notifications par e-mail", desc: "Relevés, alertes de sécurité" },
              { key: "sms", label: "Notifications SMS", desc: "Confirmations de transactions" },
              { key: "push", label: "Notifications push", desc: "Alertes en temps réel" },
              { key: "newsletter", label: "Newsletter Van Breda", desc: "Actualités et analyses mensuelles" },
              { key: "operations", label: "Alertes d'opérations", desc: "Toutes les transactions" },
              { key: "investments", label: "Alertes investissements", desc: "Variations significatives du portefeuille" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-[#1a2744]">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`w-10 h-5.5 rounded-full transition-colors relative shrink-0 ${notifications[key as keyof typeof notifications] ? "bg-[#2a7d6f]" : "bg-gray-300"}`}
                  data-testid={`toggle-notification-${key}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#1a2744] mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2a7d6f]" /> Sécurité
          </h3>
          <div className="space-y-2">
            {[
              { label: "Changer le mot de passe", desc: "Dernière modification il y a 3 mois" },
              { label: "Authentification à deux facteurs", desc: "Activée via SMS" },
              { label: "Appareils connectés", desc: "2 appareils actifs" },
              { label: "Historique des connexions", desc: "Voir les 10 dernières connexions" },
            ].map(({ label, desc }) => (
              <button key={label} className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div>
                  <div className="text-sm font-medium text-[#1a2744]">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-medium text-sm hover:bg-red-100 transition-colors"
          data-testid="button-logout-profile"
        >
          <LogOut className="w-4 h-4" /> Se déconnecter
        </button>
      </div>
    </DashboardLayout>
  );
}
