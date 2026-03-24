import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Dashboard from "@/pages/dashboard";
import Journal from "@/pages/journal";
import TradeDetails from "@/pages/trade-details";
import Analytics from "@/pages/analytics";
import Profile from "@/pages/profile";
import EditProfile from "@/pages/edit-profile";
import UpgradePlan from "@/pages/upgrade-plan";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing";
import JournalCalendar from "@/pages/journal-calendar";
import SecurityPage from "@/pages/security";
import PrivacyPage from "@/pages/privacy";
import RoadmapPage from "@/pages/roadmap";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import LearningPage from "@/pages/learning";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/app" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/app/journal" component={() => <ProtectedRoute component={Journal} />} />
      <Route path="/app/journal/calendar" component={() => <ProtectedRoute component={JournalCalendar} />} />
      <Route path="/app/journal/:id" component={() => <ProtectedRoute component={TradeDetails} />} />
      <Route path="/app/analytics" component={() => <ProtectedRoute component={Analytics} />} />
      <Route path="/app/reports" component={() => <ProtectedRoute component={ReportsPage} />} />
      <Route path="/app/learning" component={() => <ProtectedRoute component={LearningPage} />} />
      <Route path="/app/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/app/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
      <Route path="/app/profile/edit" component={() => <ProtectedRoute component={EditProfile} />} />
      <Route path="/app/profile/upgrade" component={() => <ProtectedRoute component={UpgradePlan} />} />
      <Route path="/app/roadmap" component={() => <ProtectedRoute component={RoadmapPage} />} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/roadmap" component={RoadmapPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
