import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AccountsPage from "@/pages/AccountsPage";
import CardsPage from "@/pages/CardsPage";
import InvestmentsPage from "@/pages/InvestmentsPage";
import TransfersPage from "@/pages/TransfersPage";
import DocumentsPage from "@/pages/DocumentsPage";
import MessagesPage from "@/pages/MessagesPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";
import PrivateWealthPage from "@/pages/PrivateWealthPage";
import EntrepreneurPage from "@/pages/EntrepreneurPage";
import InsurancePage from "@/pages/InsurancePage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/connexion" component={LoginPage} />
      <Route path="/gestion-privee" component={PrivateWealthPage} />
      <Route path="/entrepreneur" component={EntrepreneurPage} />
      <Route path="/assurances" component={InsurancePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/comptes" component={AccountsPage} />
      <Route path="/cartes" component={CardsPage} />
      <Route path="/investissements" component={InvestmentsPage} />
      <Route path="/virements" component={TransfersPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/profil" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
