import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Privacy</h1>
            <p className="text-muted-foreground mt-1">Your data, your control (UI preview)</p>
          </div>
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4 text-sm text-muted-foreground">
              <p>Your trades are private by default. We do not sell data.</p>
              <p>Export and deletion tools can be added when backend work begins.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
