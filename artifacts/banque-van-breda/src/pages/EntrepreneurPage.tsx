import { useLocation } from "wouter";
import { Building2, PiggyBank, ArrowUpRight, Briefcase, ArrowRight, CheckCircle } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

const services = [
  { icon: Building2, title: "Financement d'entreprise", desc: "Crédits d'investissement, lignes de crédit et solutions de financement adaptées à votre activité professionnelle." },
  { icon: PiggyBank, title: "Gestion de trésorerie", desc: "Optimisez votre trésorerie d'entreprise avec des solutions de placement et de gestion des liquidités." },
  { icon: ArrowUpRight, title: "Financement immobilier pro", desc: "Financez l'acquisition de vos locaux professionnels avec des conditions avantageuses et un suivi personnalisé." },
  { icon: Briefcase, title: "Succession d'entreprise", desc: "Planifiez la transmission de votre entreprise dans les meilleures conditions fiscales et humaines." },
];

export default function EntrepreneurPage() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <div className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#c4a35a] text-xs uppercase tracking-widest font-semibold mb-3">Pour l'entrepreneur</div>
          <h1 className="font-serif text-4xl font-bold mb-4 max-w-2xl">Votre partenaire financier professionnel</h1>
          <p className="text-gray-300 max-w-xl leading-relaxed">Des solutions financières complètes pour accompagner chaque étape du développement de votre entreprise.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-[#1a2744]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#1a2744]" />
                </div>
                <h3 className="font-serif font-semibold text-[#1a2744] text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                <a href="#" className="mt-3 flex items-center gap-1 text-[#2a7d6f] text-sm font-medium hover:underline">
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
        <div className="bg-[#1a2744] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">Développez votre activité en toute confiance</h2>
            <ul className="space-y-1">
              {["Conseiller dédié aux entrepreneurs", "Financement rapide et flexible", "Vision globale pro & privé"].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
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
