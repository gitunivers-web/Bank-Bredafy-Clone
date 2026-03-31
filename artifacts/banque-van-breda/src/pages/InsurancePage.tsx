import { useLocation } from "wouter";
import { Shield, Heart, Home, Umbrella, ArrowRight, CheckCircle } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

const products = [
  { icon: Heart, title: "Assurance vie", desc: "Protégez l'avenir financier de vos proches et constituez un capital pour votre retraite avec nos solutions d'épargne-vie.", color: "bg-red-50", iconColor: "text-red-600" },
  { icon: Shield, title: "Assurance pension libre", desc: "Constituez votre pension complémentaire avec avantage fiscal (code 1361) et des rendements attractifs.", color: "bg-[#2a7d6f]/10", iconColor: "text-[#2a7d6f]" },
  { icon: Home, title: "Protection famille", desc: "Assurez votre revenu et celui de votre famille en cas d'invalidité, d'incapacité de travail ou de décès prématuré.", color: "bg-blue-50", iconColor: "text-blue-600" },
  { icon: Umbrella, title: "Assurance hospitalisation", desc: "Une couverture complète pour les frais médicaux et hospitaliers pour vous et votre famille.", color: "bg-purple-50", iconColor: "text-purple-600" },
];

export default function InsurancePage() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <div className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#c4a35a] text-xs uppercase tracking-widest font-semibold mb-3">Assurances</div>
          <h1 className="font-serif text-4xl font-bold mb-4 max-w-2xl">Protégez ce qui compte le plus</h1>
          <p className="text-gray-300 max-w-xl leading-relaxed">Des solutions d'assurance adaptées aux besoins spécifiques des professions libérales et des chefs d'entreprise.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 ${p.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${p.iconColor}`} />
                </div>
                <h3 className="font-serif font-semibold text-[#1a2744] text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.desc}</p>
                <a href="#" className="flex items-center gap-1 text-[#2a7d6f] text-sm font-medium hover:underline">
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
        <div className="bg-[#2a7d6f]/5 border border-[#2a7d6f]/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1a2744] mb-2">Analysez gratuitement votre couverture</h2>
            <ul className="space-y-1">
              {["Analyse personnalisée", "Conseil indépendant", "Optimisation fiscale incluse"].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-[#2a7d6f]" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => setLocation("/connexion")} className="shrink-0 bg-[#2a7d6f] text-white px-6 py-3 rounded font-semibold hover:bg-[#226660] transition-colors flex items-center gap-2">
            Prendre rendez-vous <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
