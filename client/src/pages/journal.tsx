import DashboardLayout from "@/components/layout";
import { useTrades, useDeleteTrade } from "@/hooks/use-trades";
import { TradeDialog } from "@/components/trade-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Trash2, Edit2, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Journal() {
  const { data: trades, isLoading } = useTrades();
  const deleteTrade = useDeleteTrade();
  const [search, setSearch] = useState("");

  const filteredTrades = trades?.filter(trade => 
    trade.pair.toLowerCase().includes(search.toLowerCase()) ||
    trade.strategy?.toLowerCase().includes(search.toLowerCase()) ||
    trade.notes?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Trade Journal</h1>
            <p className="text-muted-foreground mt-1">Detailed log of all your positions</p>
          </div>
          <TradeDialog />
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
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">Result</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading trades...
                  </TableCell>
                </TableRow>
              ) : filteredTrades?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No trades found. Start logging!
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrades?.map((trade) => (
                  <TableRow key={trade.id} className="group">
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {new Date(trade.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold font-mono">{trade.pair}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        trade.positionType === 'long' 
                          ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' 
                          : 'border-rose-500/30 text-rose-500 bg-rose-500/10'
                      }>
                        {trade.positionType.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {trade.entryPrice}
                    </TableCell>
                    <TableCell className="text-right">
                      {trade.result && (
                        <Badge variant={
                          trade.result === 'win' ? 'default' :
                          trade.result === 'loss' ? 'destructive' : 'secondary'
                        } className={
                          trade.result === 'win' ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                        }>
                          {trade.result.toUpperCase()}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {trade.strategy || "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <TradeDialog 
                            trade={trade} 
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                            }
                          />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm('Delete this trade log?')) {
                                deleteTrade.mutate(trade.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
