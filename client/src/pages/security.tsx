import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Security</h1>
            <p className="text-muted-foreground mt-1">How we protect your data (UI preview)</p>
          </div>
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4 text-sm text-muted-foreground">
              <p>We use secure storage, encrypted connections, and least‑privilege access.</p>
              <p>Audit logs and data retention controls are planned for upcoming releases.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
