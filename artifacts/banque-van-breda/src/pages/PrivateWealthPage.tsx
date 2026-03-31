import { Link, useLocation } from "wouter";
import { TrendingUp, Shield, Users, ArrowRight, CheckCircle } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

const services = [
  { icon: TrendingUp, title: "Gestion de patrimoine", desc: "Une gestion discrétionnaire ou conseil de votre portefeuille d'investissement, adaptée à votre profil de risque et vos objectifs." },
  { icon: Shield, title: "Planification successorale", desc: "Transmettez votre patrimoine dans les meilleures conditions fiscales et juridiques, en toute sérénité." },
  { icon: Users, title: "Conseil fiscal & juridique", desc: "Un accompagnement personnalisé pour optimiser votre situation fiscale belge et internationale." },
];

export default function PrivateWealthPage() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <div className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#c4a35a] text-xs uppercase tracking-widest font-semibold mb-3">Gestion privée</div>
          <h1 className="font-serif text-4xl font-bold mb-4 max-w-2xl">Un accompagnement patrimonial d'excellence</h1>
          <p className="text-gray-300 max-w-xl leading-relaxed">Banque Van Breda met à votre disposition une équipe de spécialistes dédiés à la préservation et à la croissance de votre patrimoine.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-[#2a7d6f]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#2a7d6f]" />
                </div>
                <h3 className="font-serif font-semibold text-[#1a2744] text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="bg-[#2a7d6f]/5 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1a2744] mb-2">Prêt à optimiser votre patrimoine ?</h2>
            <ul className="space-y-1">
              {["Conseiller dédié", "Stratégie sur mesure", "Suivi régulier"].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-[#2a7d6f]" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => setLocation("/connexion")} className="shrink-0 bg-[#2a7d6f] text-white px-6 py-3 rounded font-semibold hover:bg-[#226660] transition-colors flex items-center gap-2">
            Accéder à mon espace <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
