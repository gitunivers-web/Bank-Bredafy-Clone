import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Phone, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  {
    label: "Gestion privée",
    href: "/gestion-privee",
    children: [
      { label: "Gestion de patrimoine", href: "/gestion-privee#patrimoine" },
      { label: "Planification financière", href: "/gestion-privee#planification" },
      { label: "Investissements", href: "/gestion-privee#investissements" },
      { label: "Fiscalité", href: "/gestion-privee#fiscalite" },
    ],
  },
  {
    label: "Entrepreneur",
    href: "/entrepreneur",
    children: [
      { label: "Financement entreprise", href: "/entrepreneur#financement" },
      { label: "Gestion de trésorerie", href: "/entrepreneur#tresorerie" },
      { label: "Succession d'entreprise", href: "/entrepreneur#succession" },
      { label: "Investissements professionnels", href: "/entrepreneur#investissements" },
    ],
  },
  {
    label: "Assurances",
    href: "/assurances",
    children: [
      { label: "Assurance vie", href: "/assurances#vie" },
      { label: "Assurance pension", href: "/assurances#pension" },
      { label: "Protection famille", href: "/assurances#famille" },
    ],
  },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#1a2744] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-8">
          <div className="flex items-center gap-4 text-xs text-gray-300">
            <span>BE • FR</span>
            <span>|</span>
            <a href="tel:+3232178888" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />
              +32 3 217 88 88
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Agences</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#2a7d6f] flex items-center justify-center">
                <span className="text-white font-bold text-xs">VB</span>
              </div>
              <div className="ml-2">
                <div className="text-[#1a2744] font-serif font-bold text-lg leading-tight">Banque</div>
                <div className="text-[#1a2744] font-serif font-bold text-lg leading-tight -mt-1">Van Breda</div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-[#1a2744] font-medium text-sm hover:text-[#2a7d6f] transition-colors">
                  {item.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0.5 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2a7d6f] transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="text-[#1a2744] hover:text-[#2a7d6f] p-2 transition-colors" aria-label="Recherche">
              <Search className="w-4.5 h-4.5" />
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => setLocation("/dashboard")}
                className="hidden sm:block bg-[#2a7d6f] text-white px-5 py-2 rounded text-sm font-semibold hover:bg-[#226660] transition-colors"
                data-testid="link-dashboard"
              >
                Mon espace
              </button>
            ) : (
              <button
                onClick={() => setLocation("/connexion")}
                className="hidden sm:block bg-[#2a7d6f] text-white px-5 py-2 rounded text-sm font-semibold hover:bg-[#226660] transition-colors"
                data-testid="link-login"
              >
                Se connecter
              </button>
            )}
            <button
              className="lg:hidden p-2 text-[#1a2744]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          {navItems.map((item) => (
            <div key={item.label} className="mb-3">
              <div className="font-semibold text-[#1a2744] mb-1">{item.label}</div>
              {item.children.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  className="block py-1.5 pl-3 text-sm text-gray-600 hover:text-[#2a7d6f]"
                >
                  {child.label}
                </a>
              ))}
            </div>
          ))}
          <button
            onClick={() => { setLocation(isAuthenticated ? "/dashboard" : "/connexion"); setMobileOpen(false); }}
            className="mt-4 w-full bg-[#2a7d6f] text-white py-2.5 rounded font-semibold text-sm"
          >
            {isAuthenticated ? "Mon espace" : "Se connecter"}
          </button>
        </div>
      )}
    </header>
  );
}
