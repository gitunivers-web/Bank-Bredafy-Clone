import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = login(form.getValues("email"), form.getValues("password"));
    setIsLoading(false);
    if (success) {
      toast({ title: "Connexion réussie", description: "Bienvenue dans votre espace personnel." });
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2744] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=900&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </button>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#2a7d6f] flex items-center justify-center">
              <span className="text-white font-bold text-sm">VB</span>
            </div>
            <div>
              <div className="text-white font-serif font-bold text-xl leading-tight">Banque Van Breda</div>
              <div className="text-gray-400 text-xs">Votre banque exclusive depuis 1929</div>
            </div>
          </div>
          <h2 className="font-serif text-3xl text-white font-bold mb-4 leading-tight">
            Gérez votre patrimoine en toute sécurité
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Accédez à votre espace personnel pour consulter vos comptes, gérer vos investissements et communiquer avec votre conseiller.
          </p>
          <div className="space-y-3">
            {[
              { icon: Shield, text: "Connexion sécurisée avec authentification à deux facteurs" },
              { icon: Lock, text: "Vos données protégées par un chiffrement bancaire" },
              { icon: Mail, text: "Alertes instantanées pour chaque transaction" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a7d6f]/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#2a7d6f]" />
                </div>
                <span className="text-gray-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-gray-500 text-xs">
          © {new Date().getFullYear()} Banque Van Breda & C° NV — Tous droits réservés
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <button onClick={() => setLocation("/")} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> Accueil
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2a7d6f] flex items-center justify-center">
                <span className="text-white font-bold text-xs">VB</span>
              </div>
              <span className="text-white font-serif font-semibold">Banque Van Breda</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {step === "credentials" ? (
              <>
                <div className="mb-6">
                  <h1 className="font-serif text-2xl font-bold text-[#1a2744] mb-1">Connexion</h1>
                  <p className="text-gray-500 text-sm">Accédez à votre espace personnel sécurisé</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none transition-all"
                        data-testid="input-email"
                        {...form.register("email")}
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2a7d6f] focus:border-transparent outline-none transition-all"
                        data-testid="input-password"
                        {...form.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-[#2a7d6f]"
                        {...form.register("remember")}
                      />
                      <span className="text-sm text-gray-600">Se souvenir de moi</span>
                    </label>
                    <a href="#" className="text-sm text-[#2a7d6f] hover:underline">Mot de passe oublié ?</a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2a7d6f] text-white py-3 rounded-lg font-semibold hover:bg-[#226660] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    data-testid="button-submit"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                    <p className="text-xs text-blue-700">
                      <strong>Demo:</strong> Entrez n'importe quel e-mail et mot de passe pour vous connecter.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#2a7d6f]/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-[#2a7d6f]" />
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-[#1a2744] mb-1">Vérification</h1>
                  <p className="text-gray-500 text-sm">
                    Nous avons envoyé un code à 6 chiffres à votre numéro de téléphone se terminant par <strong>••••72</strong>
                  </p>
                </div>

                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-10 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d6f] focus:border-[#2a7d6f] outline-none transition-all"
                      data-testid={`input-otp-${i}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleOtpSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#2a7d6f] text-white py-3 rounded-lg font-semibold hover:bg-[#226660] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  data-testid="button-verify"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Valider le code"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500">
                    Pas reçu le code ?{" "}
                    <button className="text-[#2a7d6f] hover:underline font-medium">Renvoyer</button>
                  </p>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Demo:</strong> Cliquez sur "Valider le code" sans saisir de code pour accéder à l'espace client.
                  </p>
                </div>

                <button
                  onClick={() => setStep("credentials")}
                  className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Retour à la connexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
