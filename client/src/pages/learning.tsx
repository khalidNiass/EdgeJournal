import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const lessons = [
  { title: "Journaling 101", desc: "Build a consistent review workflow in 10 minutes." },
  { title: "R‑Multiple Mastery", desc: "Measure outcomes without emotion or bias." },
  { title: "Edge Discovery", desc: "Find your best setups with simple filters." },
  { title: "Risk Discipline", desc: "Protect capital with repeatable risk sizing." },
];

export default function LearningPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Learning Space</h1>
          <p className="text-muted-foreground mt-1">Short lessons to improve your trading process (UI preview)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <Card key={lesson.title} className="border-none bg-card/70 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">{lesson.desc}</p>
                <Button variant="outline">Start lesson</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
