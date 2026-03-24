import DashboardLayout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function JournalCalendar() {
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" className="gap-2" onClick={() => setLocation("/app/journal")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Trade Calendar</h1>
          <p className="text-muted-foreground mt-1">Visualize your trades by day (UI preview)</p>
        </div>

        <Card className="border-none bg-card/70 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <CalendarDays className="w-4 h-4" /> Monthly overview
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
              {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted/30" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
