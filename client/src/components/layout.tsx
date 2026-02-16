import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  LineChart, 
  BookOpen, 
  LogOut, 
  Menu,
  X,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: LineChart },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight">EdgeJournal</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 mt-auto border-t border-border space-y-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="w-8 h-8 border border-border">
            <AvatarFallback className="bg-muted text-xs font-mono">
              {user?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.isPro ? 'Pro Plan' : 'Free Plan'}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">EdgeJournal</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-4">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card/30 p-4">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
