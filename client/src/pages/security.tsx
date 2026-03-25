import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Activity, Server, KeyRound } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Security</h1>
            <p className="text-muted-foreground mt-1">How we protect your data and account</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Encryption", desc: "TLS in transit and encrypted storage.", icon: Lock },
              { title: "Access Control", desc: "Least‑privilege and session hardening.", icon: KeyRound },
              { title: "Monitoring", desc: "Anomaly detection and activity logs.", icon: Activity },
              { title: "Infrastructure", desc: "Hardened servers and backups.", icon: Server },
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
                <h3 className="text-lg font-semibold">Security Practices</h3>
                <Badge variant="secondary">Active</Badge>
              </div>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Secure sessions with rotation and expiration</li>
                <li>Rate limits and brute‑force protection</li>
                <li>Backups and recovery procedures</li>
                <li>Role‑based access for internal operations</li>
              </ul>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Planned next: audit logs, device management, and security alerts.
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
