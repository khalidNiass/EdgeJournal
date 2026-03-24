import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const items = [
  { title: "v0.7", desc: "Calendar view, equity curve, onboarding tour", status: "In Progress" },
  { title: "v0.8", desc: "CSV import/export, strategy breakdowns", status: "Planned" },
  { title: "v1.0", desc: "Team workspaces, audit logs", status: "Planned" },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Roadmap</h1>
            <p className="text-muted-foreground mt-1">What’s coming next (UI preview)</p>
          </div>
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.title} className="border-none bg-card/70 shadow-sm">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <Badge variant="secondary">{item.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
