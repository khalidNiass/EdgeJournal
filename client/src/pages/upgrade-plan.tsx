import DashboardLayout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function UpgradePlan() {
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" className="gap-2" onClick={() => setLocation("/app/profile")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Upgrade Plan</h1>
          <p className="text-muted-foreground mt-1">Unlock unlimited trades and premium analytics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Badge className="bg-amber-400 text-amber-950">Gold</Badge>
              <div>
                <h3 className="text-xl font-semibold">Gold</h3>
                <p className="text-muted-foreground">Best for active traders</p>
              </div>
              <div className="text-3xl font-bold">$9<span className="text-base text-muted-foreground">/mo</span></div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Unlimited trades</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Advanced analytics</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Strategy breakdowns</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Priority support</li>
              </ul>
              <Button className="w-full" onClick={() => setLocation("/app/profile")}>Choose Gold</Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Badge className="bg-slate-300 text-slate-900">Silver</Badge>
              <div>
                <h3 className="text-xl font-semibold">Silver</h3>
                <p className="text-muted-foreground">For newer traders</p>
              </div>
              <div className="text-3xl font-bold">$4<span className="text-base text-muted-foreground">/mo</span></div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-slate-400" /> 300 trades</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-slate-400" /> Weekly analytics recap</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-slate-400" /> Trade screenshots</li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => setLocation("/app/profile")}>Choose Silver</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
