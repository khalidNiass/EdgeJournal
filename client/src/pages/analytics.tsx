import DashboardLayout from "@/components/layout";
import { useAnalytics, useTrades } from "@/hooks/use-trades";
import { CalendarRange, Gauge, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { demoTrades } from "@/lib/demo-trades";

export default function Analytics() {
  const { data: analytics, isLoading: isLoadingAnalytics } = useAnalytics();
  const { data: trades, isLoading: isLoadingTrades } = useTrades();

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

  const baseTrades = realTrades.length > 0 ? realTrades : demoTrades;

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

  const dailyData = Array.from(dailyMap.entries()).map(([day, profit]) => ({
    name: day,
    profit: Math.round(profit * 100) / 100,
  }));

  const equityData = (() => {
    let running = 0;
    return dailyData.map((day) => {
      running += day.profit;
      return { name: day.name, equity: Math.round(running * 100) / 100 };
    });
  })();

  // Win Rate Data
  const winRateData = [
    { name: 'Win', value: effectiveAnalytics?.winRate || 0 },
    { name: 'Loss', value: 100 - (effectiveAnalytics?.winRate || 0) },
  ];
  const PIE_COLORS = ['hsl(var(--profit))', 'hsl(var(--loss))'];

  const totalTrades = effectiveAnalytics?.totalTrades ?? 0;
  const winRate = effectiveAnalytics?.winRate ?? 0;
  const netProfit = effectiveAnalytics?.netProfit ?? 0;
  const avgRR = effectiveAnalytics?.avgRiskReward ?? 0;
  const profitPositive = netProfit >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Clear, interactive insights from your trading data</p>
        </div>
        {showingDemo && (
          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            Showing demo analytics so you can preview the charts. Add trades to see your real performance.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Total Trades</div>
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{totalTrades}</div>
              <div className="mt-1 text-xs text-muted-foreground">All recorded positions</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Win Rate</div>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{winRate.toFixed(1)}%</div>
              <div className="mt-1 text-xs text-muted-foreground">Wins vs losses</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Net P/L (R)</div>
                {profitPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                )}
              </div>
              <div className={`mt-3 text-2xl font-semibold ${profitPositive ? "text-emerald-500" : "text-rose-500"}`}>
                {profitPositive ? "+" : ""}{netProfit.toFixed(2)}R
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Risk‑adjusted performance</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Avg R/R</div>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{avgRR.toFixed(2)}R</div>
              <div className="mt-1 text-xs text-muted-foreground">Average risk to reward</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Performance */}
          <Card className="min-h-[400px]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Daily Performance</h3>
              <p className="text-xs text-muted-foreground -mt-4 mb-6">Profit or loss per trading day</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Win Rate Distribution */}
          <Card className="min-h-[400px]">
            <CardContent className="p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Win/Loss Ratio</h3>
              <p className="text-xs text-muted-foreground mb-4">Distribution of outcomes</p>
              <div className="flex-1 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={winRateData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {winRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{(effectiveAnalytics?.winRate ?? 0).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Win Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Strategy Breakdown</h3>
            <p className="text-xs text-muted-foreground -mt-2 mb-4">Performance by strategy label</p>
            <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-xs">Breakout</div>
                <div className="mt-2 text-lg font-semibold text-foreground">+6.2 Risk Units</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Net result measured in your planned risk</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-xs">Pullback</div>
                <div className="mt-2 text-lg font-semibold text-foreground">+2.8 Risk Units</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Net result measured in your planned risk</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-xs">Mean Reversion</div>
                <div className="mt-2 text-lg font-semibold text-foreground">-1.1 Risk Units</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Net result measured in your planned risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future detailed stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Equity Curve</h3>
            <p className="text-xs text-muted-foreground -mt-4 mb-6">Cumulative performance over time</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}R`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="equity" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
