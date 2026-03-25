import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Rocket } from "lucide-react";

const items = [
  {
    title: "v0.7",
    desc: "Calendar view, equity curve, onboarding tour",
    status: "In Progress",
    eta: "Apr 2026",
  },
  {
    title: "v0.8",
    desc: "Import/export, strategy breakdowns, report packs",
    status: "Planned",
    eta: "May 2026",
  },
  {
    title: "v1.0",
    desc: "Team workspaces, audit logs, permissions",
    status: "Planned",
    eta: "Summer 2026",
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Roadmap</h1>
            <p className="text-muted-foreground mt-1">What’s coming next</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-none bg-card/70 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Now Shipping</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  Polishing core workflows and improving reporting clarity.
                </div>
                <Badge variant="secondary">Current focus</Badge>
              </CardContent>
            </Card>
            <Card className="border-none bg-card/70 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Upcoming</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  Import/export, advanced analytics, and team-ready features.
                </div>
                <Badge variant="secondary">Next releases</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.title} className="border-none bg-card/70 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <Badge variant="secondary">{item.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                  <div className="text-xs text-muted-foreground">Target: {item.eta}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
