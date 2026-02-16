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
import { useState } from "react";

type TradeDialogProps = {
  trade?: Trade;
  trigger?: React.ReactNode;
};

export function TradeDialog({ trade, trigger }: TradeDialogProps) {
  const [open, setOpen] = useState(false);
  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade();
  
  const isEditing = !!trade;

  const form = useForm<InsertTrade>({
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
    },
  });

  const onSubmit = (data: InsertTrade) => {
    const mutation = isEditing ? updateTrade : createTrade;
    
    // @ts-ignore - handle id in mutation wrapper
    mutation.mutate(isEditing ? { id: trade.id, ...data } : data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
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

            <Button type="submit" className="w-full" disabled={createTrade.isPending || updateTrade.isPending}>
              {createTrade.isPending || updateTrade.isPending ? "Saving..." : isEditing ? "Update Trade" : "Log Trade"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
