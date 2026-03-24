import DashboardLayout from "@/components/layout";
import { useTrades, useAnalytics } from "@/hooks/use-trades";
import { StatsCard } from "@/components/stats-card";
import { TradeDialog } from "@/components/trade-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, DollarSign, Activity, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { demoTrades } from "@/lib/demo-trades";

export default function Dashboard() {
  const { data: analytics, isLoading: isLoadingAnalytics } = useAnalytics();
  const { data: trades, isLoading: isLoadingTrades } = useTrades();
  const [tourOpen, setTourOpen] = useState(false);

  if (isLoadingAnalytics || isLoadingTrades) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const realTrades = trades ?? [];
  const showingDemo = realTrades.length === 0;
  const baseTrades = showingDemo ? demoTrades : realTrades;

  const demoAnalytics = (() => {
    const totalTrades = demoTrades.length;
    const winningTrades = demoTrades.filter((t) => t.result === "win").length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    let netProfit = 0;
    demoTrades.forEach((t) => {
      if (t.result === "win") netProfit += t.riskPercent * 2;
      if (t.result === "loss") netProfit -= t.riskPercent;
    });

    return {
      totalTrades,
      winRate,
      netProfit,
      avgRiskReward: 2,
    };
  })();

  const effectiveAnalytics = showingDemo ? demoAnalytics : analytics;

  const dailyMap = new Map<string, number>();
  baseTrades.forEach((trade) => {
    const dateLabel = new Date(trade.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const current = dailyMap.get(dateLabel) ?? 0;
    let profit = 0;
    if (trade.result === "win") profit = trade.riskPercent * 2;
    if (trade.result === "loss") profit = -trade.riskPercent;
    dailyMap.set(dateLabel, current + profit);
  });

  // Daily P/L curve
  const chartData = Array.from(dailyMap.entries()).map(([day, profit]) => ({
    name: day,
    profit: Math.round(profit * 100) / 100,
  }));

  const recent = baseTrades.slice(0, 5);
  const goalTarget = 10;
  const goalProgress = Math.min(100, Math.max(0, ((effectiveAnalytics?.netProfit ?? 0) / goalTarget) * 100));

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your trading performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTourOpen(true)}>Start Tour</Button>
            <TradeDialog />
          </div>
        </div>

        {showingDemo && (
          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            Showing demo dashboard data so you can preview the experience. Add trades to see your real performance.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Trades"
            value={effectiveAnalytics?.totalTrades || 0}
            icon={<Activity className="w-12 h-12" />}
            trend="neutral"
          />
          <StatsCard
            title="Win Rate"
            value={`${(effectiveAnalytics?.winRate ?? 0).toFixed(1)}%`}
            icon={<Target className="w-12 h-12" />}
            trend={(effectiveAnalytics?.winRate ?? 0) > 50 ? 'up' : 'down'}
          />
          <StatsCard
            title="Net P/L"
            value={`$${(effectiveAnalytics?.netProfit ?? 0).toFixed(2)}`}
            icon={<DollarSign className="w-12 h-12" />}
            trend={(effectiveAnalytics?.netProfit ?? 0) >= 0 ? 'up' : 'down'}
          />
          <StatsCard
            title="Avg R:R"
            value={(effectiveAnalytics?.avgRiskReward ?? 0).toFixed(2)}
            icon={<TrendingUp className="w-12 h-12" />}
            subtext="Risk/Reward"
            trend="neutral"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          {/* Main Chart */}
          <Card className="col-span-4">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-6">Profit/Loss Curve</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorProfit)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent Trades</h3>
              <div className="space-y-4">
                {recent.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No trades recorded yet</div>
                ) : (
                  recent.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card hover:border-border transition-all cursor-default">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${
                          trade.result === 'win' ? 'bg-emerald-500' :
                          trade.result === 'loss' ? 'bg-rose-500' :
                          'bg-muted-foreground'
                        }`} />
                        <div>
                          <div className="font-bold font-mono text-sm">{trade.pair}</div>
                          <div className="text-xs text-muted-foreground capitalize">{trade.positionType}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono text-sm font-medium ${
                          trade.result === 'win' ? 'text-emerald-500' :
                          trade.result === 'loss' ? 'text-rose-500' :
                          'text-foreground'
                        }`}>
                          {trade.result ? trade.result.toUpperCase() : 'OPEN'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(trade.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Goals Tracker</h3>
              <div className="text-sm text-muted-foreground">Monthly target: {goalTarget}R</div>
              <Progress value={goalProgress} />
              <div className="text-sm text-muted-foreground">{goalProgress.toFixed(0)}% complete</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Weekly Summary</h3>
              <div className="text-sm text-muted-foreground">Automated email recap (UI preview)</div>
              <Button variant="outline">Send test summary</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={tourOpen} onOpenChange={setTourOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Quick Tour</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>1. Log trades with screenshots and notes.</div>
            <div>2. Review daily performance and equity curve.</div>
            <div>3. Track goals and improve your edge.</div>
            <Button className="w-full" onClick={() => setTourOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
