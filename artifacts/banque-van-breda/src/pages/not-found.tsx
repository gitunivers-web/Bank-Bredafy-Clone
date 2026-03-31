import { useLocation } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-serif font-bold text-[#2a7d6f] mb-4">404</div>
        <h1 className="text-2xl font-serif font-bold text-[#1a2744] mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 bg-[#2a7d6f] text-white px-4 py-2 rounded font-medium hover:bg-[#226660] transition-colors text-sm"
          >
            <Home className="w-4 h-4" /> Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
