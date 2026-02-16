import DashboardLayout from "@/components/layout";
import { useAnalytics } from "@/hooks/use-trades";
import { Loader2 } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

export default function Analytics() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Monthly Data
  const monthlyData = analytics?.monthlyPerformance.map((item: any) => ({
    name: item.month,
    profit: item.profit,
  })) || [];

  // Win Rate Data
  const winRateData = [
    { name: 'Win', value: analytics?.winRate || 0 },
    { name: 'Loss', value: 100 - (analytics?.winRate || 0) },
  ];
  const PIE_COLORS = ['hsl(var(--profit))', 'hsl(var(--loss))'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your trading statistics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Performance */}
          <div className="glass-panel p-6 rounded-xl min-h-[400px]">
            <h3 className="text-lg font-semibold mb-6">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
          </div>

          {/* Win Rate Distribution */}
          <div className="glass-panel p-6 rounded-xl min-h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Win/Loss Ratio</h3>
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
                  <div className="text-3xl font-bold">{analytics?.winRate.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for future detailed stats */}
        <div className="glass-panel p-8 rounded-xl text-center border-dashed border-2">
          <h3 className="text-lg font-semibold text-muted-foreground">More advanced analytics coming soon</h3>
          <p className="text-sm text-muted-foreground/60 mt-2">Expect drawdown charts, equity curves, and strategy breakdowns.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
