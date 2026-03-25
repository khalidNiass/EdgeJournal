import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { demoTrades } from "@/lib/demo-trades";
import { CalendarRange, Gauge, TrendingDown, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const dailyMap = new Map<string, number>();
  demoTrades.forEach((trade) => {
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

  const totalTrades = demoTrades.length;
  const winningTrades = demoTrades.filter((t) => t.result === "win").length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  let netProfit = 0;
  demoTrades.forEach((t) => {
    if (t.result === "win") netProfit += t.riskPercent * 2;
    if (t.result === "loss") netProfit -= t.riskPercent;
  });
  const avgRR = 2;
  const profitPositive = netProfit >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Clean, shareable performance summaries</p>
        </div>
        <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          Showing demo reports. Add trades to generate your own report pack.
        </div>

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

        <Card className="border-none bg-card/70 shadow-sm">
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

        <Card className="border-none bg-card/70 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Strategy Breakdown</h3>
            <p className="text-xs text-muted-foreground -mt-2 mb-4">Quick snapshot by strategy label</p>
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
      </div>
    </DashboardLayout>
  );
}
