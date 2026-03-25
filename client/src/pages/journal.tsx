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
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useLocation } from "wouter";
import { demoAfterImg, demoBeforeImg, demoTrades, type TradeRow } from "@/lib/demo-trades";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";

export default function Journal() {
  const { data: trades, isLoading } = useTrades();
  const [search, setSearch] = useState("");
  const [resultFilters, setResultFilters] = useState<Set<string>>(new Set());
  const [positionFilters, setPositionFilters] = useState<Set<string>>(new Set());
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

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

  const escapeHtml = (value: string) => {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const handleExportPdf = () => {
    const rows = filteredTrades;
    if (rows.length === 0) {
      toast({ title: "Nothing to export", description: "No trades match your current filters." });
      return;
    }

    const stamp = new Date().toLocaleString();
    const total = rows.length;
    const wins = rows.filter((t) => t.result === "win").length;
    const losses = rows.filter((t) => t.result === "loss").length;
    const breakeven = rows.filter((t) => t.result === "breakeven").length;
    const open = rows.filter((t) => !t.result || t.result === "open").length;
    const winRate = total > 0 ? Math.round((wins / total) * 1000) / 10 : 0;

    const rowsHtml = rows.map((trade) => {
      const date = trade.date ? new Date(trade.date).toLocaleString() : "";
      const exit = trade.exitTime ? new Date(trade.exitTime).toLocaleString() : "";
      return `
        <tr>
          <td>${escapeHtml(date)}</td>
          <td>${escapeHtml(exit)}</td>
          <td>${escapeHtml(trade.pair ?? "")}</td>
          <td>${escapeHtml(String(trade.entryPrice ?? ""))}</td>
          <td>${escapeHtml(String(trade.stopLoss ?? ""))}</td>
          <td>${escapeHtml(String(trade.takeProfit ?? ""))}</td>
          <td>${escapeHtml(String(trade.riskPercent ?? ""))}</td>
          <td>${escapeHtml(trade.positionType ?? "")}</td>
          <td>${escapeHtml(trade.result ?? "")}</td>
          <td>${escapeHtml(trade.strategy ?? "")}</td>
        </tr>
      `;
    }).join("");

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>EdgeJournal Trades</title>
          <style>
            :root { color-scheme: light; }
            * { box-sizing: border-box; }
            body {
              font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
              margin: 28px;
              color: #0b1220;
              background: #ffffff;
            }
            .sheet {
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 20px 24px 24px;
              background: linear-gradient(180deg, #f8fafc 0%, #ffffff 35%);
            }
            .brand {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
            }
            .logo {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              font-weight: 700;
              font-size: 18px;
              letter-spacing: .02em;
            }
            .dot {
              width: 12px;
              height: 12px;
              border-radius: 999px;
              background: #3b82f6;
              box-shadow: 0 0 0 6px rgba(59,130,246,.12);
            }
            .meta {
              text-align: right;
              font-size: 11px;
              color: #64748b;
              line-height: 1.4;
            }
            .headline {
              margin: 6px 0 2px;
              font-size: 22px;
              font-weight: 700;
            }
            .sub {
              margin: 0 0 14px;
              font-size: 12px;
              color: #64748b;
            }
            .metrics {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 16px;
            }
            .metric {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 10px 12px;
            }
            .metric .label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: .08em;
              color: #94a3b8;
              margin-bottom: 4px;
            }
            .metric .value {
              font-size: 16px;
              font-weight: 700;
            }
            .pill {
              display: inline-flex;
              padding: 2px 8px;
              border-radius: 999px;
              background: #e2e8f0;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: .08em;
              color: #475569;
            }
            table { width: 100%; border-collapse: collapse; font-size: 11px; background: #ffffff; }
            th, td { padding: 8px 10px; text-align: left; vertical-align: top; border-bottom: 1px solid #e2e8f0; }
            th {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: .08em;
              color: #94a3b8;
              background: #f8fafc;
            }
            tr:nth-child(even) td { background: #f9fafb; }
            .footer {
              margin-top: 14px;
              font-size: 10px;
              color: #94a3b8;
              display: flex;
              justify-content: space-between;
            }
            @media print {
              body { margin: 12px; }
              .sheet { border: none; border-radius: 0; padding: 0; }
              th { background: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              tr:nth-child(even) td { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .metric { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="brand">
              <div class="logo">
                <span class="dot"></span>
                EdgeJournal
              </div>
              <div class="meta">
                Trade Journal Export<br />
                ${escapeHtml(stamp)}
              </div>
            </div>
            <div class="headline">Performance Snapshot</div>
            <div class="sub">Filtered export from your journal</div>
            <div class="metrics">
              <div class="metric">
                <div class="label">Trades</div>
                <div class="value">${total}</div>
              </div>
              <div class="metric">
                <div class="label">Win Rate</div>
                <div class="value">${winRate}%</div>
              </div>
              <div class="metric">
                <div class="label">Wins / Losses</div>
                <div class="value">${wins} / ${losses}</div>
              </div>
              <div class="metric">
                <div class="label">Open</div>
                <div class="value">${open}</div>
              </div>
            </div>
            <div class="pill">Trade Details</div>
            <table>
              <thead>
                <tr>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Pair</th>
                  <th>Entry</th>
                  <th>Stop</th>
                  <th>Target</th>
                  <th>Risk %</th>
                  <th>Type</th>
                  <th>Result</th>
                  <th>Strategy</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
            <div class="footer">
              <span>Generated by EdgeJournal</span>
              <span>${breakeven > 0 ? `${breakeven} breakeven` : ""}</span>
            </div>
          </div>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({ title: "Popup blocked", description: "Allow popups to export PDF." });
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    toast({ title: "PDF ready", description: "Use the print dialog to save as PDF." });
  };

  const parseCsv = (text: string) => {
    const rows: string[][] = [];
    let current: string[] = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"' && inQuotes && next === '"') {
        value += '"';
        i += 1;
        continue;
      }

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === "," && !inQuotes) {
        current.push(value);
        value = "";
        continue;
      }

      if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") i += 1;
        current.push(value);
        if (current.some((cell) => cell.trim() !== "")) {
          rows.push(current);
        }
        current = [];
        value = "";
        continue;
      }

      value += char;
    }

    if (value.length > 0 || current.length > 0) {
      current.push(value);
      if (current.some((cell) => cell.trim() !== "")) {
        rows.push(current);
      }
    }

    return rows;
  };

  const normalizeHeader = (value: string) => value.trim().toLowerCase();

  const handleImportCsv = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) {
      toast({ title: "Import failed", description: "CSV file is empty." });
      return;
    }

    const headers = rows[0].map(normalizeHeader);
    const required = ["pair", "entryprice", "stoploss", "takeprofit", "riskpercent", "positiontype"];
    const missing = required.filter((key) => !headers.includes(key));
    if (missing.length > 0) {
      toast({ title: "Import failed", description: `Missing columns: ${missing.join(", ")}` });
      return;
    }

    const headerIndex = new Map(headers.map((header, index) => [header, index]));
    const getCell = (row: string[], key: string) => row[headerIndex.get(key) ?? -1] ?? "";

    let created = 0;
    let failed = 0;

    for (let i = 1; i < rows.length; i += 1) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const pair = getCell(row, "pair").trim();
      const entryPrice = Number(getCell(row, "entryprice"));
      const stopLoss = Number(getCell(row, "stoploss"));
      const takeProfit = Number(getCell(row, "takeprofit"));
      const riskPercent = Number(getCell(row, "riskpercent"));
      const positionType = getCell(row, "positiontype").trim().toLowerCase();

      if (!pair || !Number.isFinite(entryPrice) || !Number.isFinite(stopLoss) || !Number.isFinite(takeProfit) || !Number.isFinite(riskPercent)) {
        failed += 1;
        continue;
      }

      const dateValue = getCell(row, "date");
      const exitValue = getCell(row, "exittime");
      const parsedDate = dateValue ? new Date(dateValue) : new Date();
      const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      const parsedExit = exitValue ? new Date(exitValue) : null;
      const safeExit = parsedExit && Number.isNaN(parsedExit.getTime()) ? null : parsedExit;
      const safePosition = positionType === "short" ? "short" : "long";
      const payload = {
        pair,
        entryPrice,
        stopLoss,
        takeProfit,
        riskPercent,
        positionType: safePosition,
        result: getCell(row, "result").trim() || "open",
        strategy: getCell(row, "strategy").trim() || "",
        notes: getCell(row, "notes").trim() || "",
        date: safeDate.toISOString(),
        exitTime: safeExit ? safeExit.toISOString() : null,
        beforeImg: getCell(row, "beforeimg").trim() || null,
        afterImg: getCell(row, "afterimg").trim() || null,
      };

      try {
        const res = await fetch(api.trades.create.path, {
          method: api.trades.create.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          failed += 1;
          continue;
        }
        created += 1;
      } catch {
        failed += 1;
      }
    }

    if (created > 0) {
      queryClient.invalidateQueries({ queryKey: [api.trades.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analytics.get.path] });
    }

    toast({
      title: "Import complete",
      description: `Added ${created} trades${failed > 0 ? `, ${failed} failed` : ""}.`,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleImportCsv(file).finally(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

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
            <Button variant="outline" onClick={handleExportPdf}>Export PDF</Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Import CSV</Button>
            <TradeDialog />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />

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
