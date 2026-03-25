import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Brain,
  Target,
  Award,
  PlayCircle,
} from "lucide-react";

const learningPaths = [
  { level: "Beginner", desc: "Build a solid journaling habit", progress: 30, lessons: 6 },
  { level: "Intermediate", desc: "Sharpen edge discovery & review", progress: 10, lessons: 8 },
  { level: "Advanced", desc: "Refine execution and psychology", progress: 0, lessons: 7 },
];

const playbooks = [
  {
    id: "playbook-breakout",
    name: "Breakout",
    rules: ["Higher‑timeframe trend aligned", "Break + retest", "Stop below structure"],
    checklist: ["Confirm volume", "Define invalidation", "Plan partials"],
  },
  {
    id: "playbook-pullback",
    name: "Pullback",
    rules: ["Trend intact", "Pull to key level", "Trigger on confirmation"],
    checklist: ["Check liquidity", "Set R target", "Manage entry"],
  },
  {
    id: "playbook-mean-reversion",
    name: "Mean Reversion",
    rules: ["Range identified", "Reversion signal", "Tight stop"],
    checklist: ["Define range extremes", "Avoid news", "Scale out"],
  },
];

const reviewLessons = [
  { id: "review-what-happened", title: "What Happened", desc: "Summarize setup, entry, and outcome.", duration: "6 min", level: "Beginner" },
  { id: "review-improve", title: "What To Improve", desc: "Spot 1‑2 fixes for next time.", duration: "8 min", level: "Intermediate" },
  { id: "review-quiz", title: "Quick Quiz", desc: "Check your understanding.", duration: "3 min", level: "Beginner" },
];

const mindsetModules = [
  { id: "mindset-discipline", title: "Discipline Reset", desc: "Recover focus after a loss.", level: "Beginner" },
  { id: "mindset-tilt", title: "Tilt Control", desc: "Catch emotional spirals early.", level: "Intermediate" },
  { id: "mindset-routine", title: "Pre‑Trade Routine", desc: "A 4‑step ritual to stay calm.", level: "Beginner" },
  { id: "mindset-recovery", title: "Loss Recovery", desc: "How to avoid revenge trading.", level: "Advanced" },
];

const lessonDetails: Record<string, { title: string; steps: string[]; tip: string }> = {
  "review-what-happened": {
    title: "What Happened",
    steps: [
      "Describe the setup and market context.",
      "Log the entry trigger and confirmation.",
      "Summarize outcome vs plan.",
    ],
    tip: "Keep it short and objective.",
  },
  "review-improve": {
    title: "What To Improve",
    steps: [
      "Identify 1 mistake or missed step.",
      "Define the correction for next trade.",
      "Add a checklist rule.",
    ],
    tip: "Focus on 1 change at a time.",
  },
  "review-quiz": {
    title: "Quick Quiz",
    steps: [
      "What is your invalidation level?",
      "Where is your first target?",
      "What is your max risk?",
    ],
    tip: "Answer out loud to reinforce.",
  },
  "mindset-discipline": {
    title: "Discipline Reset",
    steps: [
      "Take a 5‑minute break.",
      "Review your written plan.",
      "Only trade if rules align.",
    ],
    tip: "Discipline beats motivation.",
  },
  "mindset-tilt": {
    title: "Tilt Control",
    steps: [
      "Spot early signs of tilt.",
      "Reduce size for next trade.",
      "Pause after 2 losses.",
    ],
    tip: "Protect your edge, not your ego.",
  },
  "mindset-routine": {
    title: "Pre‑Trade Routine",
    steps: [
      "Check news and volatility.",
      "Mark key levels.",
      "Confirm risk and size.",
    ],
    tip: "Routines reduce mistakes.",
  },
  "mindset-recovery": {
    title: "Loss Recovery",
    steps: [
      "Log the loss objectively.",
      "Review rule adherence.",
      "Reset for next session.",
    ],
    tip: "No revenge trades.",
  },
};

const glossary = [
  { term: "R‑multiple", meaning: "Result measured in your planned risk." },
  { term: "Risk‑Reward (RR)", meaning: "Potential reward vs planned risk." },
  { term: "Liquidity", meaning: "Areas where orders cluster." },
  { term: "Structure", meaning: "Key highs/lows defining trend." },
  { term: "Edge", meaning: "Repeatable advantage with data." },
];

export default function LearningPage() {
  const storageKey = "edgejournal_learning_progress_v1";
  const [accountSize, setAccountSize] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(1.2);
  const [stopLoss, setStopLoss] = useState(1.19);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [savedPlaybooks, setSavedPlaybooks] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [playbookChecks, setPlaybookChecks] = useState<Record<string, boolean>>({});
  const [weeklyChecks, setWeeklyChecks] = useState({
    plan: true,
    checklist: false,
    risk: false,
    review: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        completed?: Record<string, boolean>;
        weeklyChecks?: typeof weeklyChecks;
        savedPlaybooks?: Record<string, boolean>;
        playbookChecks?: Record<string, boolean>;
      };
      if (parsed.completed) setCompleted(parsed.completed);
      if (parsed.weeklyChecks) setWeeklyChecks(parsed.weeklyChecks);
      if (parsed.savedPlaybooks) setSavedPlaybooks(parsed.savedPlaybooks);
      if (parsed.playbookChecks) setPlaybookChecks(parsed.playbookChecks);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ completed, weeklyChecks, savedPlaybooks, playbookChecks }),
    );
  }, [completed, weeklyChecks, savedPlaybooks, playbookChecks]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSavePlaybook = (id: string) => {
    setSavedPlaybooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlaybookCheck = (id: string) => {
    setPlaybookChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredReviews = useMemo(() => {
    return reviewLessons.filter((lesson) => {
      const matchesSearch = lesson.title.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = filterLevel === "all" || lesson.level === filterLevel;
      const isDone = !!completed[lesson.id];
      return matchesSearch && matchesLevel && (showCompleted || !isDone);
    });
  }, [search, filterLevel, showCompleted, completed]);

  const filteredMindset = useMemo(() => {
    return mindsetModules.filter((module) => {
      const matchesSearch = module.title.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = filterLevel === "all" || module.level === filterLevel;
      const isDone = !!completed[module.id];
      return matchesSearch && matchesLevel && (showCompleted || !isDone);
    });
  }, [search, filterLevel, showCompleted, completed]);

  const totalLessons = reviewLessons.length + mindsetModules.length;
  const completedLessons = Object.entries(completed).filter(([key, value]) =>
    value && (reviewLessons.some((l) => l.id === key) || mindsetModules.some((m) => m.id === key)),
  ).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const riskMetrics = useMemo(() => {
    const riskAmount = (accountSize * riskPercent) / 100;
    const riskPerUnit = Math.abs(entryPrice - stopLoss);
    const positionSize = riskPerUnit > 0 ? riskAmount / riskPerUnit : 0;
    return {
      riskAmount: Number.isFinite(riskAmount) ? riskAmount : 0,
      positionSize: Number.isFinite(positionSize) ? positionSize : 0,
    };
  }, [accountSize, riskPercent, entryPrice, stopLoss]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Learning Space</h1>
            <p className="text-muted-foreground mt-1">Structured learning, practice, and progress tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View Certificate</Button>
            <Button>Continue Learning</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                Progress
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{progressPercent}%</div>
              <Progress value={progressPercent} className="mt-3 h-2" />
            </CardContent>
          </Card>
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                Weekly Streak
                <Award className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold">3 weeks</div>
              <div className="mt-1 text-xs text-muted-foreground">Keep the momentum going</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                Lessons Completed
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{completedLessons} / {totalLessons}</div>
              <div className="mt-1 text-xs text-muted-foreground">Across all paths</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                Certificates
                <Award className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold">1 unlocked</div>
              <div className="mt-1 text-xs text-muted-foreground">Advanced review basics</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Learning Paths</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Input
                  placeholder="Search lessons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-xs"
                />
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  Show completed
                  <Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
                </div>
              </div>
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <div key={path.level} className="rounded-lg border bg-background/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{path.level}</div>
                        <div className="text-xs text-muted-foreground">{path.desc}</div>
                      </div>
                      <Badge variant="secondary">{path.lessons} lessons</Badge>
                    </div>
                    <div className="mt-3">
                      <Progress value={path.progress} className="h-2" />
                      <div className="mt-1 text-xs text-muted-foreground">{path.progress}% complete</div>
                    </div>
                    <Button variant="outline" className="mt-3">Continue</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Playbook Templates</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {playbooks.map((playbook) => (
                  <div key={playbook.name} className="rounded-lg border bg-background/70 p-4 space-y-2">
                    <div className="text-sm font-semibold">{playbook.name}</div>
                    <div className="text-xs text-muted-foreground">Rules</div>
                    <div className="text-xs">
                      {playbook.rules.join(" • ")}
                    </div>
                    <div className="text-xs text-muted-foreground">Checklist</div>
                    <div className="space-y-2 text-xs">
                      {playbook.checklist.map((item) => {
                        const checkId = `${playbook.id}:${item}`;
                        return (
                          <label key={checkId} className="flex items-center gap-2">
                            <Checkbox
                              checked={!!playbookChecks[checkId]}
                              onCheckedChange={() => togglePlaybookCheck(checkId)}
                            />
                            {item}
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Open</Button>
                      <Button
                        size="sm"
                        variant={savedPlaybooks[playbook.id] ? "default" : "outline"}
                        onClick={() => toggleSavePlaybook(playbook.id)}
                      >
                        {savedPlaybooks[playbook.id] ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Trade Review Lessons</h3>
              </div>
              <div className="space-y-3">
                {filteredReviews.map((lesson) => (
                  <div key={lesson.title} className="flex items-center justify-between rounded-lg border bg-background/70 p-4">
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <Checkbox
                          checked={!!completed[lesson.id]}
                          onCheckedChange={() => toggleComplete(lesson.id)}
                        />
                        {lesson.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{lesson.desc}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{lesson.duration}</Badge>
                      <Button size="sm" variant="outline" onClick={() => setActiveLessonId(lesson.id)}>
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                Quick quiz: What is your invalidation level on a breakout trade?
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">Above highs</Button>
                  <Button size="sm" variant="outline">Below structure</Button>
                  <Button size="sm" variant="outline">No stop needed</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Psychology & Mindset</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredMindset.map((module) => (
                  <div key={module.title} className="rounded-lg border bg-background/70 p-4">
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <Checkbox
                        checked={!!completed[module.id]}
                        onCheckedChange={() => toggleComplete(module.id)}
                      />
                      {module.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{module.desc}</div>
                    <Button size="sm" variant="outline" className="mt-3" onClick={() => setActiveLessonId(module.id)}>
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Risk Management Lab</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-xs text-muted-foreground">Account size</label>
                  <Input
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs text-muted-foreground">Risk %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs text-muted-foreground">Entry</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs text-muted-foreground">Stop</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-background/70 p-4">
                  <div className="text-xs text-muted-foreground">Risk Amount</div>
                  <div className="mt-2 text-lg font-semibold font-mono">${riskMetrics.riskAmount.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border bg-background/70 p-4">
                  <div className="text-xs text-muted-foreground">Position Size</div>
                  <div className="mt-2 text-lg font-semibold font-mono">{riskMetrics.positionSize.toFixed(2)}</div>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Scenario: If volatility doubles, reduce risk % by half and recalc.
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Video + Notes</h3>
              </div>
              <div className="rounded-xl border bg-background/70 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-6 w-6" />
                    Play lesson
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-sm font-semibold">Breakout Structure Review</div>
                  <div className="text-xs text-muted-foreground">Timestamped notes</div>
                  <div className="text-xs">00:45 — Liquidity sweep explanation</div>
                  <div className="text-xs">03:10 — Entry vs confirmation</div>
                  <div className="text-xs">06:20 — Managing partials</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Weekly Challenge</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={weeklyChecks.plan}
                    onCheckedChange={(value) => setWeeklyChecks((prev) => ({ ...prev, plan: Boolean(value) }))}
                  />
                  Take 3 trades only if A + B + C are met.
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={weeklyChecks.checklist}
                    onCheckedChange={(value) => setWeeklyChecks((prev) => ({ ...prev, checklist: Boolean(value) }))}
                  />
                  Complete the pre‑trade checklist before entry.
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={weeklyChecks.risk}
                    onCheckedChange={(value) => setWeeklyChecks((prev) => ({ ...prev, risk: Boolean(value) }))}
                  />
                  Risk no more than 1R per trade.
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={weeklyChecks.review}
                    onCheckedChange={(value) => setWeeklyChecks((prev) => ({ ...prev, review: Boolean(value) }))}
                  />
                  Review 5 trades and log improvements.
                </div>
              </div>
              <Button variant="outline">Claim badge</Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Glossary & Concepts</h3>
              </div>
              <div className="grid gap-3">
                {glossary.map((item) => (
                  <div key={item.term} className="rounded-lg border bg-background/70 p-4">
                    <div className="text-sm font-semibold">{item.term}</div>
                    <div className="text-xs text-muted-foreground">{item.meaning}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!activeLessonId} onOpenChange={(open) => setActiveLessonId(open ? activeLessonId : null)}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>
                {activeLessonId && (lessonDetails[activeLessonId]?.title || "Lesson")}
              </DialogTitle>
            </DialogHeader>
            {activeLessonId && lessonDetails[activeLessonId] ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                  {lessonDetails[activeLessonId].tip}
                </div>
                <div className="space-y-2 text-sm">
                  {lessonDetails[activeLessonId].steps.map((step) => (
                    <div key={step} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    toggleComplete(activeLessonId);
                    setActiveLessonId(null);
                  }}
                >
                  Mark as Complete
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">
                This playbook includes your checklist and rules. Use it before every trade.
                <Button className="w-full" onClick={() => setActiveLessonId(null)}>
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
