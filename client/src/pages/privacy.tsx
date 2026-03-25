import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, EyeOff, FileText, Trash2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Privacy</h1>
            <p className="text-muted-foreground mt-1">Your data, your control</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Private by default", desc: "Trades are visible only to you.", icon: EyeOff },
              { title: "No data selling", desc: "We do not sell your information.", icon: ShieldCheck },
              { title: "Transparency", desc: "Clear data usage and retention.", icon: FileText },
              { title: "Delete anytime", desc: "Request removal of account data.", icon: Trash2 },
            ].map((item) => (
              <Card key={item.title} className="border-none bg-card/80 shadow-sm">
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Data Controls</h3>
                <Badge variant="secondary">In progress</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                You can export your journal and request deletion of account data. We’ll surface these tools once the
                backend is fully connected.
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                We only collect what’s needed to run the product and improve performance.
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
