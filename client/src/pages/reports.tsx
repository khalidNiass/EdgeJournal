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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Performance summaries and breakdowns (UI preview)</p>
        </div>

        <Card className="border-none bg-card/70 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Equity Curve</h3>
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
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-xs">Breakout</div>
                <div className="mt-2 text-lg font-semibold text-foreground">+6.2R</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-xs">Pullback</div>
                <div className="mt-2 text-lg font-semibold text-foreground">+2.8R</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-xs">Mean Reversion</div>
                <div className="mt-2 text-lg font-semibold text-foreground">-1.1R</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
