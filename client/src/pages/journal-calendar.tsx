import DashboardLayout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { useTrades } from "@/hooks/use-trades";
import { demoAfterImg, demoBeforeImg, demoTrades, type TradeRow } from "@/lib/demo-trades";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function JournalCalendar() {
  const [, setLocation] = useLocation();
  const { data: trades } = useTrades();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const realTrades: TradeRow[] = useMemo(() => {
    return (trades ?? []).map((trade) => ({
      id: trade.id,
      date: trade.date,
      pair: trade.pair,
      entryPrice: trade.entryPrice,
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      riskPercent: trade.riskPercent,
      positionType: trade.positionType,
      result: trade.result,
      strategy: trade.strategy,
      notes: trade.notes,
      beforeImg: (trade as unknown as { beforeImg?: string | null }).beforeImg ?? null,
      afterImg: (trade as unknown as { afterImg?: string | null }).afterImg ?? null,
      exitTime: (trade as unknown as { exitTime?: string | null }).exitTime ?? null,
      isDemo: false,
    }));
  }, [trades]);

  const baseTrades = realTrades.length > 0 ? realTrades : demoTrades;

  const viewDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const startOffset = (startDay + 6) % 7; // Monday-first

  const dayMap = useMemo(() => {
    const map = new Map<string, { count: number; net: number }>();
    baseTrades.forEach((trade) => {
      const date = new Date(trade.date);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toISOString().slice(0, 10);
      const current = map.get(key) ?? { count: 0, net: 0 };
      let profit = 0;
      if (trade.result === "win") profit = trade.riskPercent * 2;
      if (trade.result === "loss") profit = -trade.riskPercent;
      map.set(key, { count: current.count + 1, net: Math.round((current.net + profit) * 100) / 100 });
    });
    return map;
  }, [baseTrades]);

  const getTradeImage = (value?: string | null, fallback?: string) => {
    return value || fallback || "";
  };

  const tradesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return baseTrades.filter((trade) => {
      const date = new Date(trade.date);
      if (Number.isNaN(date.getTime())) return false;
      return date.toISOString().slice(0, 10) === selectedDate;
    });
  }, [baseTrades, selectedDate]);

  const monthSummary = useMemo(() => {
    let total = 0;
    let wins = 0;
    let net = 0;
    dayMap.forEach((value, key) => {
      const keyDate = new Date(key);
      if (keyDate.getFullYear() !== year || keyDate.getMonth() !== month) return;
      total += value.count;
      net += value.net;
    });
    baseTrades.forEach((trade) => {
      const date = new Date(trade.date);
      if (date.getFullYear() === year && date.getMonth() === month && trade.result === "win") {
        wins += 1;
      }
    });
    const winRate = total > 0 ? Math.round((wins / total) * 1000) / 10 : 0;
    return { total, wins, net, winRate };
  }, [baseTrades, dayMap, month, year]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" className="gap-2" onClick={() => setLocation("/app/journal")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Trade Calendar</h1>
          <p className="text-muted-foreground mt-1">Visualize your trades by day</p>
        </div>

        <Card className="border-none bg-card/70 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4" /> Monthly overview
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setMonthOffset((prev) => prev - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-semibold min-w-[180px] text-center">{monthLabel}</div>
                <Button variant="outline" size="icon" onClick={() => setMonthOffset((prev) => prev + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setMonthOffset(0)}>Today</Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="rounded-lg border bg-background/70 p-3">
                <div className="text-xs text-muted-foreground">Trades</div>
                <div className="text-lg font-semibold">{monthSummary.total}</div>
              </div>
              <div className="rounded-lg border bg-background/70 p-3">
                <div className="text-xs text-muted-foreground">Win Rate</div>
                <div className="text-lg font-semibold">{monthSummary.winRate}%</div>
              </div>
              <div className="rounded-lg border bg-background/70 p-3">
                <div className="text-xs text-muted-foreground">Net P/L (R)</div>
                <div className={`text-lg font-semibold ${monthSummary.net >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {monthSummary.net >= 0 ? "+" : ""}{monthSummary.net.toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border bg-background/70 p-3">
                <div className="text-xs text-muted-foreground">Wins</div>
                <div className="text-lg font-semibold">{monthSummary.wins}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-muted-foreground">
              {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {Array.from({ length: 42 }).map((_, i) => {
                const day = i - startOffset + 1;
                const isCurrentMonth = day >= 1 && day <= daysInMonth;
                const dateKey = isCurrentMonth ? new Date(year, month, day).toISOString().slice(0, 10) : "";
                const cell = dateKey ? dayMap.get(dateKey) : undefined;
                const net = cell?.net ?? 0;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg border p-2 text-xs ${
                      isCurrentMonth ? "bg-background/70" : "bg-muted/30 text-muted-foreground/50"
                    }`}
                    role={cell ? "button" : undefined}
                    tabIndex={cell ? 0 : -1}
                    onClick={() => {
                      if (!cell || !dateKey) return;
                      setSelectedDate(dateKey);
                    }}
                    onKeyDown={(e) => {
                      if (!cell || !dateKey) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedDate(dateKey);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{isCurrentMonth ? day : ""}</div>
                      {cell && (
                        <Badge variant="secondary" className="text-[10px]">
                          {cell.count}
                        </Badge>
                      )}
                    </div>
                    {cell && (
                      <div className={`mt-2 text-[10px] font-mono ${net >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {net >= 0 ? "+" : ""}{net.toFixed(2)}R
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">Number = trades</Badge>
              <Badge variant="secondary">Green = net positive</Badge>
              <Badge variant="secondary">Red = net negative</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedDate} onOpenChange={(open) => setSelectedDate(open ? selectedDate : null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>
              Trades on {selectedDate ? new Date(selectedDate).toLocaleDateString() : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {tradesForSelectedDate.length === 0 ? (
              <div className="text-sm text-muted-foreground">No trades for this day.</div>
            ) : (
              tradesForSelectedDate.map((trade) => (
                <div
                  key={trade.id}
                  className="rounded-lg border bg-card/70 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold font-mono">{trade.pair}</div>
                      <div className="text-xs text-muted-foreground">
                        {trade.positionType.toUpperCase()} · Entry {trade.entryPrice} · Stop {trade.stopLoss} · Target {trade.takeProfit}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Entry {new Date(trade.date).toLocaleString()}
                        {trade.exitTime ? ` · Exit ${new Date(trade.exitTime).toLocaleString()}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Strategy: {trade.strategy || "—"} · Risk {trade.riskPercent}%
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="secondary">{(trade.result ?? "open").toUpperCase()}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/app/journal/${trade.id}`)}
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border bg-muted/30 overflow-hidden">
                      <img
                        src={getTradeImage(trade.beforeImg, demoBeforeImg)}
                        alt="Before trade"
                        className="h-24 w-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg border bg-muted/30 overflow-hidden">
                      <img
                        src={getTradeImage(trade.afterImg, demoAfterImg)}
                        alt="After trade"
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  </div>
                  {trade.notes && (
                    <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                      {trade.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
