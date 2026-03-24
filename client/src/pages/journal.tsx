import DashboardLayout from "@/components/layout";
import { useTrades } from "@/hooks/use-trades";
import { TradeDialog } from "@/components/trade-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter } from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useLocation } from "wouter";
import { demoAfterImg, demoBeforeImg, demoTrades, type TradeRow } from "@/lib/demo-trades";

export default function Journal() {
  const { data: trades, isLoading } = useTrades();
  const [search, setSearch] = useState("");
  const [resultFilters, setResultFilters] = useState<Set<string>>(new Set());
  const [positionFilters, setPositionFilters] = useState<Set<string>>(new Set());
  const [, setLocation] = useLocation();

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
      isDemo: false,
    }));
  }, [trades]);

  const baseTrades = realTrades.length > 0 ? realTrades : demoTrades;
  const showingDemo = realTrades.length === 0 && !isLoading;

  const filteredTrades = baseTrades.filter((trade) => {
    const matchesSearch =
      trade.pair.toLowerCase().includes(search.toLowerCase()) ||
      trade.strategy?.toLowerCase().includes(search.toLowerCase()) ||
      trade.notes?.toLowerCase().includes(search.toLowerCase());

    const normalizedResult = trade.result ?? "open";
    const matchesResult =
      resultFilters.size === 0 || resultFilters.has(normalizedResult);

    const matchesPosition =
      positionFilters.size === 0 || positionFilters.has(trade.positionType);

    return matchesSearch && matchesResult && matchesPosition;
  });

  const toggleFilter = (setFn: Dispatch<SetStateAction<Set<string>>>, value: string) => {
    setFn((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const resultBadge = (result: string | null) => {
    if (!result) return null;
    const upper = result.toUpperCase();
    const className =
      result === "win"
        ? "bg-emerald-500 hover:bg-emerald-600"
        : result === "loss"
          ? "bg-rose-500 hover:bg-rose-600"
          : result === "breakeven"
            ? "bg-amber-500 hover:bg-amber-600"
            : "bg-slate-500 hover:bg-slate-600";

    return (
      <Badge variant="default" className={className}>
        {upper}
      </Badge>
    );
  };

  const positionBadge = (positionType: string) => {
    const className =
      positionType === "long"
        ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
        : "border-rose-500/30 text-rose-500 bg-rose-500/10";

    return (
      <Badge variant="outline" className={className}>
        {positionType.toUpperCase()}
      </Badge>
    );
  };

  const getTradeImage = (value?: string | null, fallback?: string) => {
    return value || fallback || "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Trade Journal</h1>
            <p className="text-muted-foreground mt-1">Detailed log of all your positions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setLocation("/app/journal/calendar")}>Calendar</Button>
            <Button variant="outline" onClick={() => alert("Export CSV (UI only)")}>Export CSV</Button>
            <Button variant="outline" onClick={() => alert("Import CSV (UI only)")}>Import CSV</Button>
            <TradeDialog />
          </div>
        </div>

        <div className="flex gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search pairs, strategies, notes..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Result</DropdownMenuLabel>
              {["win", "loss", "breakeven", "open"].map((value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={resultFilters.has(value)}
                  onCheckedChange={() => toggleFilter(setResultFilters, value)}
                >
                  {value.toUpperCase()}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Position</DropdownMenuLabel>
              {["long", "short"].map((value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={positionFilters.has(value)}
                  onCheckedChange={() => toggleFilter(setPositionFilters, value)}
                >
                  {value.toUpperCase()}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  setResultFilters(new Set());
                  setPositionFilters(new Set());
                }}
              >
                Clear Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {showingDemo && (
          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            Showing demo trades so you can preview the journal. Add a trade to replace these with your real data.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Loading trades...
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No trades found. Start logging!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTrades.map((trade) => (
              <Card
                key={trade.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => setLocation(`/app/journal/${trade.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLocation(`/app/journal/${trade.id}`);
                  }
                }}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border bg-muted/30 overflow-hidden">
                      <img
                        src={getTradeImage(trade.beforeImg, demoBeforeImg)}
                        alt="Before trade"
                        className="h-20 w-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg border bg-muted/30 overflow-hidden">
                      <img
                        src={getTradeImage(trade.afterImg, demoAfterImg)}
                        alt="After trade"
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(trade.date).toLocaleDateString()}
                      </div>
                      <div className="text-xl font-semibold font-mono">
                        {trade.pair}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {resultBadge(trade.result)}
                      {trade.isDemo && <Badge variant="secondary">Demo</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {positionBadge(trade.positionType)}
                    <Badge variant="outline" className="font-mono text-xs">
                      Entry {trade.entryPrice}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {trade.strategy || "No strategy"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
