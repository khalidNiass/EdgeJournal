import DashboardLayout from "@/components/layout";
import { useTrades, useAnalytics } from "@/hooks/use-trades";
import { StatsCard } from "@/components/stats-card";
import { TradeDialog } from "@/components/trade-dialog";
import { Loader2, TrendingUp, DollarSign, Activity, Target } from "lucide-react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";

export default function Dashboard() {
  const { data: analytics, isLoading: isLoadingAnalytics } = useAnalytics();
  const { data: recentTrades, isLoading: isLoadingTrades } = useTrades();

  if (isLoadingAnalytics || isLoadingTrades) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Format chart data
  const chartData = analytics?.monthlyPerformance.map((item: any) => ({
    name: item.month,
    profit: item.profit,
  })) || [];

  const recent = recentTrades?.slice(0, 5) || [];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your trading performance</p>
          </div>
          <TradeDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Trades"
            value={analytics?.totalTrades || 0}
            icon={<Activity className="w-12 h-12" />}
            trend="neutral"
          />
          <StatsCard
            title="Win Rate"
            value={`${analytics?.winRate.toFixed(1)}%`}
            icon={<Target className="w-12 h-12" />}
            trend={analytics?.winRate > 50 ? 'up' : 'down'}
          />
          <StatsCard
            title="Net P/L"
            value={`$${analytics?.netProfit.toFixed(2)}`}
            icon={<DollarSign className="w-12 h-12" />}
            trend={analytics?.netProfit >= 0 ? 'up' : 'down'}
          />
          <StatsCard
            title="Avg R:R"
            value={analytics?.avgRiskReward.toFixed(2)}
            icon={<TrendingUp className="w-12 h-12" />}
            subtext="Risk/Reward"
            trend="neutral"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          {/* Main Chart */}
          <div className="col-span-4 glass-panel rounded-xl p-6">
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
          </div>

          {/* Recent Activity */}
          <div className="col-span-3 glass-panel rounded-xl p-6">
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
