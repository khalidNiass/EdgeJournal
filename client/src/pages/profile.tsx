import DashboardLayout from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics, useTrades } from "@/hooks/use-trades";
import { demoTrades } from "@/lib/demo-trades";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

function computeAnalytics(trades: Array<{ result: string | null; riskPercent: number }>) {
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.result === "win").length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  let netProfit = 0;
  trades.forEach((t) => {
    if (t.result === "win") netProfit += t.riskPercent * 2;
    if (t.result === "loss") netProfit -= t.riskPercent;
  });

  return {
    totalTrades,
    winRate,
    netProfit,
    avgRiskReward: 2,
  };
}

export default function Profile() {
  const { user } = useAuth();
  const { data: analytics, isLoading: isLoadingAnalytics } = useAnalytics();
  const { data: trades, isLoading: isLoadingTrades } = useTrades();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const realTrades = trades ?? [];
  const showingDemo = realTrades.length === 0 && !isLoadingTrades;
  const effectiveAnalytics = showingDemo ? computeAnalytics(demoTrades) : analytics ?? computeAnalytics(realTrades);

  const [profile, setProfile] = useState({
    displayName: user?.username ?? "",
    email: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    tradingStyle: "",
    bio: "",
  });
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const initials = useMemo(() => {
    if (!user?.username) return "U";
    return user.username.slice(0, 2).toUpperCase();
  }, [user?.username]);

  if (isLoadingAnalytics || isLoadingTrades) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarFallback className="bg-muted text-lg font-mono">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{user?.username ?? "Your Profile"}</h1>
                <Badge variant={user?.isPro ? "default" : "secondary"}>
                  {user?.isPro ? "Pro" : "Free"}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">Manage your account and trading preferences</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setLocation("/app/profile/edit")}>
              Edit Profile
            </Button>
            <Button onClick={() => setLocation("/app/profile/upgrade")}>
              Upgrade Plan
            </Button>
          </div>
        </div>

        {showingDemo && (
          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            Showing demo profile stats so you can preview the experience. Add trades to see your real performance.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">Total Trades</div>
              <div className="text-2xl font-bold mt-2 font-mono">{effectiveAnalytics.totalTrades}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-2xl font-bold mt-2 font-mono">{effectiveAnalytics.winRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">Net P/L</div>
              <div className="text-2xl font-bold mt-2 font-mono">${effectiveAnalytics.netProfit.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">Avg R:R</div>
              <div className="text-2xl font-bold mt-2 font-mono">{effectiveAnalytics.avgRiskReward.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Profile Details</h3>
                <p className="text-sm text-muted-foreground">Update how your profile appears</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Trader name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, timezone: e.target.value }))}
                    placeholder="UTC"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="style">Trading style</Label>
                  <Input
                    id="style"
                    value={profile.tradingStyle}
                    onChange={(e) => setProfile((prev) => ({ ...prev, tradingStyle: e.target.value }))}
                    placeholder="Breakouts, scalping, swing"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Short intro about your trading approach"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    setLastSavedAt(new Date());
                    toast({ title: "Profile updated", description: "Changes saved locally (demo)." });
                  }}
                >
                  Save Changes
                </Button>
                {lastSavedAt && (
                  <div className="text-xs text-muted-foreground text-center">
                    Saved {lastSavedAt.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
