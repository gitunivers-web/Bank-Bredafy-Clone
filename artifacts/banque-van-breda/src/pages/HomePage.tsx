import { Link, useLocation } from "wouter";
import { ArrowRight, Shield, TrendingUp, Users, Award, ChevronRight, PlayCircle } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

const stats = [
  { value: "95+", label: "années d'expérience" },
  { value: "60 000+", label: "clients satisfaits" },
  { value: "22 Mds€", label: "d'actifs gérés" },
  { value: "1929", label: "année de fondation" },
];

const services = [
  {
    icon: TrendingUp,
    title: "Gestion de patrimoine",
    desc: "Une approche personnalisée pour faire fructifier et protéger votre patrimoine sur le long terme.",
    href: "/gestion-privee",
    color: "bg-[#2a7d6f]",
  },
  {
    icon: Users,
    title: "Entrepreneur",
    desc: "Des solutions financières adaptées aux besoins spécifiques des chefs d'entreprise.",
    href: "/entrepreneur",
    color: "bg-[#1a2744]",
  },
  {
    icon: Shield,
    title: "Assurances",
    desc: "Protégez ce qui compte le plus : votre famille, votre entreprise et votre avenir.",
    href: "/assurances",
    color: "bg-[#c4a35a]",
  },
  {
    icon: Award,
    title: "Planification successorale",
    desc: "Préparez la transmission de votre patrimoine en toute sérénité et efficacité fiscale.",
    href: "/gestion-privee#succession",
    color: "bg-[#2a5a7d]",
  },
];

const news = [
  {
    date: "28 mars 2026",
    category: "Marchés financiers",
    title: "Perspectives d'investissement pour le second trimestre 2026",
    excerpt: "Notre équipe d'experts partage son analyse des marchés et les opportunités d'investissement pour les prochains mois.",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
  },
  {
    date: "15 mars 2026",
    category: "Fiscalité",
    title: "Nouvelles règles fiscales belges 2026 : ce qui change pour vous",
    excerpt: "Un tour d'horizon des modifications fiscales en vigueur cette année et de leur impact sur votre planification patrimoniale.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
  },
  {
    date: "5 mars 2026",
    category: "Succession",
    title: "Comment optimiser la transmission d'entreprise familiale",
    excerpt: "Les outils juridiques et financiers pour assurer la pérennité de votre entreprise familiale et minimiser la charge fiscale.",
    img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
  },
];

const testimonials = [
  {
    name: "Dr. Sophie Martens",
    role: "Médecin spécialiste",
    text: "Banque Van Breda comprend les défis spécifiques des professions libérales. Mon conseiller m'accompagne depuis 12 ans avec une expertise et une disponibilité remarquables.",
  },
  {
    name: "Marc Janssen",
    role: "CEO, Groupe Janssen",
    text: "La banque idéale pour un chef d'entreprise. Ils gèrent aussi bien mes finances professionnelles que personnelles avec une vision globale et cohérente.",
  },
  {
    name: "Isabelle Lecomte",
    role: "Notaire",
    text: "Un partenaire de confiance depuis ma création d'étude. Leurs conseils en planification patrimoniale m'ont permis d'optimiser ma situation financière de façon significative.",
  },
];

export default function HomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero */}
      <section className="relative bg-[#1a2744] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=700&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-block bg-[#2a7d6f] text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
              Banque exclusive depuis 1929
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Votre partenaire financier de confiance pour les professions libérales
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Banque Van Breda est spécialisée dans l'accompagnement des médecins, avocats, notaires et chefs d'entreprise. Une relation bancaire sur mesure, fondée sur la confiance et l'expertise.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setLocation("/connexion")}
                className="bg-[#2a7d6f] text-white px-6 py-3 rounded font-semibold hover:bg-[#226660] transition-colors flex items-center gap-2"
                data-testid="hero-login-button"
              >
                Accéder à mon espace
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-white/40 text-white px-6 py-3 rounded font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                Découvrir nos services
              </button>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 1000 0 720 0C440 0 240 60 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-serif font-bold text-[#2a7d6f] mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-[#1a2744] mb-3">Nos expertises</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Une offre complète de services financiers conçus pour les profils exigeants qui cherchent un accompagnement global et personnalisé.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <a
                  key={service.title}
                  href={service.href}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-11 h-11 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif font-semibold text-[#1a2744] text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{service.desc}</p>
                  <div className="flex items-center gap-1 text-[#2a7d6f] text-sm font-medium group-hover:gap-2 transition-all">
                    En savoir plus <ChevronRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[#2a7d6f] text-sm font-semibold uppercase tracking-widest mb-3">Notre clientèle</div>
              <h2 className="font-serif text-3xl font-bold text-[#1a2744] mb-4">
                Une banque spécialisée pour des profils d'exception
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Depuis 1929, Banque Van Breda accompagne exclusivement les professions libérales, les chefs d'entreprise et les dirigeants. Notre spécialisation nous permet de comprendre précisément vos enjeux et de vous proposer des solutions vraiment adaptées.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {["Médecins & dentistes", "Avocats & notaires", "Pharmaciens", "Vétérinaires", "Architectes", "Chefs d'entreprise"].map((p) => (
                  <div key={p} className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2a7d6f]" />
                    {p}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setLocation("/connexion")}
                className="bg-[#1a2744] text-white px-6 py-3 rounded font-semibold hover:bg-[#142035] transition-colors flex items-center gap-2"
              >
                Devenir client <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=500&fit=crop"
                alt="Conseiller Van Breda"
                className="rounded-xl shadow-lg w-full object-cover h-80 lg:h-96"
              />
              <div className="absolute -bottom-4 -left-4 bg-[#2a7d6f] text-white p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-serif font-bold">4.8/5</div>
                <div className="text-xs text-green-100">Satisfaction client</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#1a2744] mb-1">Actualités & Insights</h2>
              <p className="text-gray-600">Les dernières analyses de nos experts</p>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1 text-[#2a7d6f] text-sm font-medium hover:underline">
              Toutes les actualités <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((article) => (
              <article key={article.title} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="overflow-hidden h-44">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#2a7d6f] text-xs font-semibold">{article.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-400 text-xs">{article.date}</span>
                  </div>
                  <h3 className="font-serif font-semibold text-[#1a2744] mb-2 leading-tight line-clamp-2">{article.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                  <a href="#" className="mt-3 flex items-center gap-1 text-[#2a7d6f] text-sm font-medium hover:underline">
                    Lire la suite <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Ils nous font confiance</h2>
            <p className="text-gray-400">Ce que disent nos clients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/10">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className="text-[#c4a35a] text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic mb-4">"{t.text}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2a7d6f]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Prêt à prendre rendez-vous avec votre conseiller?
          </h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Découvrez comment Banque Van Breda peut vous accompagner dans la gestion de votre patrimoine et l'optimisation de votre situation financière.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-[#2a7d6f] px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors">
              Prendre rendez-vous
            </button>
            <button
              onClick={() => setLocation("/connexion")}
              className="border border-white text-white px-6 py-3 rounded font-semibold hover:bg-white/10 transition-colors"
            >
              Accéder à mon espace
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
