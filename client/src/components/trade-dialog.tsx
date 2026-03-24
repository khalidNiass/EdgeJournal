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
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";

type TradeDialogProps = {
  trade?: Trade;
  trigger?: React.ReactNode;
};

export function TradeDialog({ trade, trigger }: TradeDialogProps) {
  const [open, setOpen] = useState(false);
  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade();

  const isEditing = !!trade;

  const [beforeImg, setBeforeImg] = useState<string | null>(trade?.beforeImg || null);
  const [afterImg, setAfterImg] = useState<string | null>(trade?.afterImg || null);

  const form = useForm<InsertTrade & {
    beforeImg?: string;
    afterImg?: string;
    durationMinutes?: number;
    accountSize?: number;
    positionSize?: number;
    livePrice?: number;
  }>({
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
      beforeImg: null,
      afterImg: null,
      durationMinutes: 0,
      accountSize: 10000,
      positionSize: 0,
      livePrice: undefined,
    },
  });

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

  const onSubmit = (data: InsertTrade) => {
    const mutation = isEditing ? updateTrade : createTrade;
    const tradeData = {
      ...data,
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
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
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
                <div className="text-xs text-muted-foreground">Duration (preview)</div>
                <div className="mt-1 font-mono">
                  {form.watch("durationMinutes") ? `${form.watch("durationMinutes")} min` : "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="rounded-lg bg-muted/30 p-3 text-sm">
              <div className="text-xs text-muted-foreground">Live Price (coming soon)</div>
              <div className="mt-1 font-mono">--</div>
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

            <div className="grid grid-cols-2 gap-4">
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
