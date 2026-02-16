import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, subtext, trend, icon }: StatsCardProps) {
  return (
    <Card className="glass-panel overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        {icon}
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold font-mono-nums">{value}</div>
          {trend && (
            <div className={`flex items-center text-xs font-medium ${
              trend === 'up' ? 'text-emerald-500' : 
              trend === 'down' ? 'text-rose-500' : 
              'text-muted-foreground'
            }`}>
              {trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
              {trend === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
              {trend === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
              {subtext}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
