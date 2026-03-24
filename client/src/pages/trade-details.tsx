import DashboardLayout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TradeDialog } from "@/components/trade-dialog";
import { useDeleteTrade, useTrades } from "@/hooks/use-trades";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { demoAfterImg, demoBeforeImg, demoTrades, type TradeRow } from "@/lib/demo-trades";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function resultBadge(result: string | null) {
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
}

function positionBadge(positionType: string) {
  const className =
    positionType === "long"
      ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
      : "border-rose-500/30 text-rose-500 bg-rose-500/10";

  return (
    <Badge variant="outline" className={className}>
      {positionType.toUpperCase()}
    </Badge>
  );
}

function getTradeImage(value?: string | null, fallback?: string) {
  return value || fallback || "";
}

export default function TradeDetails() {
  const [, params] = useRoute("/app/journal/:id");
  const [, setLocation] = useLocation();
  const { data: trades, isLoading } = useTrades();
  const deleteTrade = useDeleteTrade();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const tradeId = params?.id ? Number(params.id) : Number.NaN;

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

  const showingDemo = realTrades.length === 0 && !isLoading;
  const trade =
    realTrades.find((item) => item.id === tradeId) ||
    (showingDemo ? demoTrades.find((item) => item.id === tradeId) : undefined);

  const entryTime = trade ? new Date(trade.date) : null;
  const exitTime = trade?.exitTime ? new Date(trade.exitTime) : null;
  const durationMinutes = entryTime && exitTime ? Math.max(0, Math.round((exitTime.getTime() - entryTime.getTime()) / 60000)) : null;

  const rMultiple = trade ? (() => {
    if (!trade.result || trade.result === "open") return null;
    const risk = trade.positionType === "long"
      ? trade.entryPrice - trade.stopLoss
      : trade.stopLoss - trade.entryPrice;
    if (risk <= 0) return null;
    if (trade.result === "loss") return -1;
    if (trade.result === "breakeven") return 0;
    const reward = trade.positionType === "long"
      ? trade.takeProfit - trade.entryPrice
      : trade.entryPrice - trade.takeProfit;
    return Math.round((reward / risk) * 100) / 100;
  })() : null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          Loading trade...
        </div>
      </DashboardLayout>
    );
  }

  if (!trade) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Button variant="ghost" className="gap-2" onClick={() => setLocation("/app/journal")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Trade not found.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Button variant="ghost" className="gap-2" onClick={() => setLocation("/app/journal")}>
              <ArrowLeft className="h-4 w-4" />
              Back to Journal
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-mono">{trade.pair}</h1>
              {resultBadge(trade.result)}
              {trade.isDemo && <Badge variant="secondary">Demo</Badge>}
            </div>
            <div className="text-muted-foreground">
              {new Date(trade.date).toLocaleString()}
            </div>
          </div>

          {!trade.isDemo && (
            <div className="flex flex-wrap gap-2">
              <TradeDialog trade={trade as any} trigger={<Button variant="outline">Edit Trade</Button>} />
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Delete this trade log?")) {
                    deleteTrade.mutate(trade.id);
                    setLocation("/app/journal");
                  }
                }}
              >
                Delete Trade
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="text-sm text-muted-foreground">Trade Summary</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Position</div>
                  <div className="mt-1">{positionBadge(trade.positionType)}</div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <div className="mt-1 font-mono">{trade.riskPercent}%</div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Entry</div>
                  <div className="mt-1 font-mono">{trade.entryPrice}</div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Stop Loss</div>
                  <div className="mt-1 font-mono text-rose-500">{trade.stopLoss}</div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Take Profit</div>
                  <div className="mt-1 font-mono text-emerald-500">{trade.takeProfit}</div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Result</div>
                  <div className="mt-1">{resultBadge(trade.result) || "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="text-sm text-muted-foreground">Trade Timeline</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Entry Time</div>
                    <div className="mt-1 font-mono">{entryTime ? entryTime.toLocaleString() : "—"}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Exit Time</div>
                    <div className="mt-1 font-mono">{exitTime ? exitTime.toLocaleString() : "Not set"}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="mt-1 font-mono">
                      {durationMinutes !== null ? `${durationMinutes} min` : "—"}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">R Multiple</div>
                    <div className="mt-1 font-mono">
                      {rMultiple !== null ? `${rMultiple}R` : "—"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Strategy</div>
              <div className="rounded-lg border bg-card p-3 text-sm">
                {trade.strategy || "—"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Notes</div>
              <div className="rounded-lg border bg-card p-3 text-sm">
                {trade.notes || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Before</div>
            <div className="rounded-lg border bg-muted/30 overflow-hidden">
              <img
                src={getTradeImage(trade.beforeImg, demoBeforeImg)}
                alt="Before trade"
                className="h-64 w-full object-cover"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">After</div>
            <div className="rounded-lg border bg-muted/30 overflow-hidden">
              <img
                src={getTradeImage(trade.afterImg, demoAfterImg)}
                alt="After trade"
                className="h-64 w-full object-cover"
                onClick={() => {
                  setLightboxIndex(1);
                  setLightboxOpen(true);
                }}
              />
            </div>
          </div>
        </div>

      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Trade Screenshots</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={lightboxIndex === 0 ? getTradeImage(trade.beforeImg, demoBeforeImg) : getTradeImage(trade.afterImg, demoAfterImg)}
              alt={lightboxIndex === 0 ? "Before trade" : "After trade"}
              className="w-full max-h-[70vh] object-contain rounded-lg bg-muted/30"
            />
            <div className="absolute inset-y-0 left-2 flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLightboxIndex((prev) => (prev === 0 ? 1 : 0))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLightboxIndex((prev) => (prev === 0 ? 1 : 0))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
