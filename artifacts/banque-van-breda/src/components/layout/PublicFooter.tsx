import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[#1a2744] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#2a7d6f] flex items-center justify-center">
                <span className="text-white font-bold text-xs">VB</span>
              </div>
              <div>
                <div className="text-white font-serif font-bold text-base leading-tight">Banque</div>
                <div className="text-white font-serif font-bold text-base leading-tight -mt-0.5">Van Breda</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              La banque exclusive pour les professions libérales et les chefs d'entreprise depuis 1929.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Nos services</h4>
            <ul className="space-y-2">
              {[
                "Gestion de patrimoine",
                "Planification financière",
                "Investissements",
                "Assurances",
                "Financement",
                "Succession",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Informations</h4>
            <ul className="space-y-2">
              {[
                "À propos de nous",
                "Nos agences",
                "Carrières",
                "Actualités",
                "Responsabilité sociale",
                "Durabilité",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#2a7d6f] mt-0.5 shrink-0" />
                <div>
                  <div className="text-white text-sm">+32 3 217 88 88</div>
                  <div className="text-gray-400 text-xs">Lun–Ven: 8h00–18h00</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#2a7d6f] mt-0.5 shrink-0" />
                <a href="mailto:info@vanbreda.be" className="text-gray-400 text-sm hover:text-white transition-colors">
                  info@vanbreda.be
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2a7d6f] mt-0.5 shrink-0" />
                <div className="text-gray-400 text-sm">
                  Plantin en Moretuslei 295<br />
                  2140 Antwerpen, Belgique
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Banque Van Breda & C° NV — Tous droits réservés
          </p>
          <div className="flex items-center gap-4">
            {["Mentions légales", "Vie privée", "Cookies", "MiFID"].map((item) => (
              <a key={item} href="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
