import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTradeSchema, type InsertTrade, type Trade } from "@shared/schema";
import { useCreateTrade, useUpdateTrade } from "@/hooks/use-trades";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, LogIn, LogOut, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TradeDialogProps = {
  trade?: Trade;
  trigger?: React.ReactNode;
};

type TradeFormValues = Omit<InsertTrade, "date" | "exitTime"> & {
  date?: string | Date;
  exitTime?: string | Date | null;
  beforeImg?: string;
  afterImg?: string;
  durationMinutes?: number;
  accountSize?: number;
  positionSize?: number;
  livePrice?: number;
};

type DateParts = {
  month: string;
  day: string;
  year: string;
  time: string;
};

export function TradeDialog({ trade, trigger }: TradeDialogProps) {
  const [open, setOpen] = useState(false);
  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade();

  const isEditing = !!trade;

  const [beforeImg, setBeforeImg] = useState<string | null>(trade?.beforeImg || null);
  const [afterImg, setAfterImg] = useState<string | null>(trade?.afterImg || null);

  const toDateTimeLocal = (value?: string | Date | null) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const toDateParts = (value?: string | Date | null, fallbackToNow?: boolean): DateParts => {
    if (!value && !fallbackToNow) {
      return { month: "", day: "", year: "", time: "" };
    }
    const date = value ? (value instanceof Date ? value : new Date(value)) : new Date();
    if (Number.isNaN(date.getTime())) {
      return { month: "", day: "", year: "", time: "" };
    }
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      month: pad(date.getMonth() + 1),
      day: pad(date.getDate()),
      year: String(date.getFullYear()),
      time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    };
  };

  const buildDateTime = (parts: DateParts) => {
    const month = Number(parts.month);
    const day = Number(parts.day);
    const year = Number(parts.year);
    const timeOk = /^\d{2}:\d{2}$/.test(parts.time);
    if (!month || !day || !year || !timeOk) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 1900) return null;
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const yyyy = String(year).padStart(4, "0");
    return `${yyyy}-${mm}-${dd}T${parts.time}`;
  };

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(insertTradeSchema),
    defaultValues: trade ? {
      pair: trade.pair,
      entryPrice: trade.entryPrice,
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      riskPercent: trade.riskPercent,
      positionType: trade.positionType as "long" | "short",
      result: trade.result || undefined,
      strategy: trade.strategy || undefined,
      notes: trade.notes || undefined,
      date: toDateTimeLocal(trade.date),
      exitTime: trade.exitTime ? toDateTimeLocal(trade.exitTime) : "",
      durationMinutes: undefined,
      accountSize: 10000,
      positionSize: undefined,
      livePrice: undefined,
    } : {
      pair: "",
      entryPrice: 0,
      stopLoss: 0,
      takeProfit: 0,
      riskPercent: 1,
      positionType: "long",
      result: "open",
      strategy: "",
      notes: "",
      date: toDateTimeLocal(new Date()),
      exitTime: "",
      beforeImg: null,
      afterImg: null,
      durationMinutes: 0,
      accountSize: 10000,
      positionSize: 0,
      livePrice: undefined,
    },
  });

  const [entryParts, setEntryParts] = useState<DateParts>(() =>
    toDateParts(trade ? trade.date : new Date(), true),
  );
  const [exitParts, setExitParts] = useState<DateParts>(() => {
    if (trade?.exitTime) {
      return toDateParts(trade.exitTime, false);
    }
    const fallback = toDateParts(trade ? trade.date : new Date(), true);
    return { ...fallback, time: "" };
  });

  useEffect(() => {
    if (!open) return;
    const values = form.getValues();
    const nextEntry = toDateParts(values.date ?? null, true);
    setEntryParts(nextEntry);
    if (values.exitTime) {
      setExitParts(toDateParts(values.exitTime ?? null, false));
    } else {
      setExitParts({ ...nextEntry, time: "" });
    }
  }, [open, form]);

  const rMultiple = useMemo(() => {
    const entry = form.watch("entryPrice");
    const stop = form.watch("stopLoss");
    const take = form.watch("takeProfit");
    const positionType = form.watch("positionType");
    if (!entry || !stop || !take) return null;
    const risk = positionType === "short" ? stop - entry : entry - stop;
    if (risk <= 0) return null;
    const reward = positionType === "short" ? entry - take : take - entry;
    return Math.round((reward / risk) * 100) / 100;
  }, [form.watch("entryPrice"), form.watch("stopLoss"), form.watch("takeProfit"), form.watch("positionType")]);

  const positionSize = useMemo(() => {
    const accountSize = form.watch("accountSize") || 0;
    const riskPercent = form.watch("riskPercent") || 0;
    const entry = form.watch("entryPrice") || 0;
    const stop = form.watch("stopLoss") || 0;
    const positionType = form.watch("positionType");
    const riskPerUnit = positionType === "short" ? stop - entry : entry - stop;
    if (riskPerUnit <= 0 || accountSize <= 0 || riskPercent <= 0) return 0;
    const riskAmount = (accountSize * riskPercent) / 100;
    return Math.round((riskAmount / riskPerUnit) * 100) / 100;
  }, [
    form.watch("accountSize"),
    form.watch("riskPercent"),
    form.watch("entryPrice"),
    form.watch("stopLoss"),
    form.watch("positionType"),
  ]);

  const livePrice = useMemo(() => {
    const entry = form.watch("entryPrice") || 0;
    if (!entry) return null;
    const mock = entry * 1.0012;
    return Math.round(mock * 100000) / 100000;
  }, [form.watch("entryPrice")]);

  const durationMinutes = useMemo(() => {
    const entry = form.watch("date");
    const exit = form.watch("exitTime");
    if (!entry || !exit) return null;
    const entryDate = new Date(entry);
    const exitDate = new Date(exit);
    if (Number.isNaN(entryDate.getTime()) || Number.isNaN(exitDate.getTime())) return null;
    const diff = Math.round((exitDate.getTime() - entryDate.getTime()) / 60000);
    return diff < 0 ? 0 : diff;
  }, [form.watch("date"), form.watch("exitTime")]);

  useEffect(() => {
    if (durationMinutes === null) {
      form.setValue("durationMinutes", undefined);
      return;
    }
    form.setValue("durationMinutes", durationMinutes, { shouldDirty: true });
  }, [durationMinutes, form]);

  const updateEntryParts = (patch: Partial<DateParts>) => {
    setEntryParts((prev) => {
      const next = { ...prev, ...patch };
      const built = buildDateTime(next);
      if (built) {
        form.setValue("date", built, { shouldDirty: true });
      }
      return next;
    });
  };

  const updateExitParts = (patch: Partial<DateParts>) => {
    setExitParts((prev) => {
      const next = { ...prev, ...patch };
      const built = buildDateTime(next);
      if (built) {
        form.setValue("exitTime", built, { shouldDirty: true });
      } else {
        form.setValue("exitTime", "", { shouldDirty: true });
      }
      return next;
    });
  };

  useEffect(() => {
    const exitHasValue = !!form.watch("exitTime");
    if (exitHasValue) return;
    setExitParts((prev) => {
      const next = { ...prev, month: entryParts.month, day: entryParts.day, year: entryParts.year };
      return next;
    });
  }, [entryParts.month, entryParts.day, entryParts.year, form]);

  const onSubmit = (data: TradeFormValues) => {
    const mutation = isEditing ? updateTrade : createTrade;
    const normalized = {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      exitTime: data.exitTime ? new Date(data.exitTime) : null,
    };
    const tradeData = {
      ...normalized,
      beforeImg,
      afterImg,
    };
    // @ts-ignore - handle id in mutation wrapper
    mutation.mutate(isEditing ? { id: trade.id, ...tradeData } : tradeData, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        setBeforeImg(null);
        setAfterImg(null);
      },
    });
  };

  // Helper to convert file to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Trade" : "Log New Trade"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="pair"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pair/Asset</FormLabel>
                    <FormControl>
                      <Input placeholder="EURUSD" {...field} className="uppercase font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="positionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="long">Long</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    Entry Time
                  </div>
                  <div className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Local time
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Month</div>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={entryParts.month}
                      onChange={(e) => updateEntryParts({ month: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Day</div>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={entryParts.day}
                      onChange={(e) => updateEntryParts({ day: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Year</div>
                    <Input
                      type="number"
                      min="1900"
                      max="2100"
                      value={entryParts.year}
                      onChange={(e) => updateEntryParts({ year: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Time</div>
                    <Input
                      type="time"
                      value={entryParts.time}
                      onChange={(e) => updateEntryParts({ time: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Auto-filled from the current date and editable.
                </div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    Exit Time
                  </div>
                  <div className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Optional
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Month</div>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={exitParts.month}
                      onChange={(e) => updateExitParts({ month: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Day</div>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={exitParts.day}
                      onChange={(e) => updateExitParts({ day: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Year</div>
                    <Input
                      type="number"
                      min="1900"
                      max="2100"
                      value={exitParts.year}
                      onChange={(e) => updateExitParts({ year: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Time</div>
                    <Input
                      type="time"
                      value={exitParts.time}
                      onChange={(e) => updateExitParts({ time: e.target.value })}
                      className="h-10 w-full bg-background/80 font-mono"
                    />
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Leave empty for open trades.
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Trade Duration
                </div>
                <div className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Auto
                </div>
              </div>
              <div className="mt-3">
                <Input
                  value={durationMinutes !== null ? `${durationMinutes} min` : "—"}
                  readOnly
                  className="h-11 bg-background/80 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Loss</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className="font-mono text-rose-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Take Profit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className="font-mono text-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg bg-muted/30 p-3 text-sm">
              <div className="text-xs text-muted-foreground">R Multiple (preview)</div>
              <div className="mt-1 font-mono">{rMultiple !== null ? `${rMultiple}R` : "—"}</div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="accountSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="rounded-lg bg-muted/30 p-3 text-sm">
                <div className="text-xs text-muted-foreground">Position Size (auto)</div>
                <div className="mt-1 font-mono">{positionSize ? positionSize : "—"}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Based on account size, risk %, and stop distance.</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="riskPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Result</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "open"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="loss">Loss</SelectItem>
                        <SelectItem value="breakeven">Breakeven</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Live Price</div>
                  <div className="text-xs text-muted-foreground">Connect broker to stream pricing</div>
                </div>
                <div className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Mock
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-2xl font-semibold font-mono">
                  {livePrice !== null ? livePrice : "--"}
                </div>
                <Button variant="outline" size="sm">Connect broker</Button>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                Prices update after broker connection.
              </div>
            </div>

            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategy</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Trend Breakout" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Analysis, emotions, execution notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-medium mb-1">Before Screenshot</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setBeforeImg)} />
                {beforeImg && (
                  <img src={beforeImg} alt="Before Screenshot" className="mt-2 rounded max-h-32 border" />
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">After Screenshot</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setAfterImg)} />
                {afterImg && (
                  <img src={afterImg} alt="After Screenshot" className="mt-2 rounded max-h-32 border" />
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={createTrade.isPending || updateTrade.isPending}>
              {createTrade.isPending || updateTrade.isPending ? "Saving..." : isEditing ? "Update Trade" : "Log Trade"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
