import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ShieldCheck,
  Sparkles,
  LineChart,
  NotebookPen,
  Brain,
  CheckCircle2,
  ArrowRight,
  Zap,
  Trophy,
  Target,
  Star,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const features = [
  {
    title: "Structured trade logs",
    desc: "Capture entries, exits, screenshots, and emotions in one clean workflow.",
    icon: NotebookPen,
  },
  {
    title: "Performance analytics",
    desc: "Win rate, R multiples, equity curves, and daily insights at a glance.",
    icon: LineChart,
  },
  {
    title: "Edge discovery",
    desc: "Spot patterns, filter noise, and scale what’s working with confidence.",
    icon: Brain,
  },
];

const benefits = [
  "Daily performance review",
  "Before/after chart gallery",
  "Trade notes + emotions",
  "Equity curve tracking",
  "Quick filters & search",
  "Secure by design",
];

const logos = ["Apex Desk", "Pulse Capital", "Northbridge", "Bluecrest", "Orion", "FinEdge"];

const testimonials = [
  {
    name: "T. Walker",
    role: "Futures trader",
    quote: "The journaling flow is fast and focused. My A‑setups improved in two weeks.",
  },
  {
    name: "R. Chen",
    role: "FX swing trader",
    quote: "The equity curve and R multiple view made my review process much clearer.",
  },
  {
    name: "S. Patel",
    role: "Prop firm",
    quote: "Best trading journal I’ve used. Clean, disciplined, and genuinely useful.",
  },
];

const pricing = [
  {
    tier: "Silver",
    price: "$4",
    note: "/mo",
    highlight: false,
    points: ["300 trades", "Weekly analytics recap", "Trade screenshots"],
  },
  {
    tier: "Gold",
    price: "$9",
    note: "/mo",
    highlight: true,
    points: ["Unlimited trades", "Advanced analytics", "Strategy breakdowns", "Priority support"],
  },
];

const faqs = [
  {
    q: "Can I start for free?",
    a: "Yes. You can sign up and explore the app before upgrading.",
  },
  {
    q: "Can I export my trades?",
    a: "CSV export is on the roadmap. We can add it next if you want.",
  },
  {
    q: "Is my data secure?",
    a: "We use secure storage and best‑practice access controls.",
  },
];

export default function LandingPage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-block p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 backdrop-blur-sm">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">EdgeJournal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href="#features">Features</a>
            <a className="hover:text-foreground" href="#screenshots">Screenshots</a>
            <a className="hover:text-foreground" href="#testimonials">Testimonials</a>
            <a className="hover:text-foreground" href="#pricing">Pricing</a>
            <a className="hover:text-foreground" href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-primary/15 rounded-full blur-[120px]" />
            <div className="absolute -bottom-48 -left-32 w-[420px] h-[420px] bg-emerald-500/10 rounded-full blur-[140px]" />
          </div>
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="gap-2 w-fit bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-4 h-4" /> Pro-grade trading journal
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Build a repeatable edge with a journal that actually works.
              </h1>
              <p className="text-lg text-muted-foreground">
                EdgeJournal gives you clarity on every trade so you can improve faster, trade smarter, and stay disciplined.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth">
                  <Button size="lg" className="gap-2">
                    Start Journaling <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline">See Demo</Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Bank‑grade security
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-primary" /> Actionable metrics
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border-none bg-card/70 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <NotebookPen className="w-4 h-4" /> Trade Snapshot
                    </div>
                    <Badge variant="secondary">+2.0R</Badge>
                  </div>
                  <div className="text-2xl font-bold font-mono">EURUSD · Long</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground">Strategy</div>
                      <div className="mt-1 font-semibold">London Breakout</div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="mt-1 font-semibold">1h 35m</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none bg-card/70 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Brain className="w-4 h-4" /> Edge Insights
                  </div>
                  <div className="text-2xl font-bold">Breakout setups outperform by 18%</div>
                  <p className="text-sm text-muted-foreground">
                    Your A‑setups are consistently delivering above 1.8R average.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-14">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs uppercase tracking-wider text-muted-foreground">
            {logos.map((name) => (
              <div key={name} className="flex items-center justify-center rounded-lg bg-card/40 py-3 shadow-sm">
                {name}
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item) => (
              <Card key={item.title} className="border-none bg-card/70 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <item.icon className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Everything you need to improve your edge</h2>
            <p className="text-muted-foreground">
              Built for professional traders who want a streamlined system for journaling and performance tracking.
            </p>
            <div className="grid gap-3">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                </div>
              ))}
            </div>
          </div>
          <Card className="border-none bg-card/70 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="text-sm text-muted-foreground">Weekly Review</div>
              <div className="text-2xl font-bold">12 trades • 58% win rate</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Net P/L</div>
                  <div className="mt-1 font-semibold text-emerald-500">+4.6R</div>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Best Setup</div>
                  <div className="mt-1 font-semibold">Breakout</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">View full report</Button>
            </CardContent>
          </Card>
        </section>

        <section id="screenshots" className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-none bg-card/70 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" /> Product Preview
                </div>
                <div className="aspect-[16/10] rounded-xl bg-muted/30" />
                <p className="text-sm text-muted-foreground">Clean journal grid, trade details, and screenshots.</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-card/70 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4" /> Analytics Preview
                </div>
                <div className="aspect-[16/10] rounded-xl bg-muted/30" />
                <p className="text-sm text-muted-foreground">Equity curve, daily performance, and insights.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="testimonials" className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-none bg-card/70 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Star key={idx} className="w-4 h-4" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">“{item.quote}”</p>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Zap className="w-4 h-4" /> Pricing
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {pricing.map((plan) => (
              <Card
                key={plan.tier}
                className={plan.highlight ? "border-none bg-card/80 shadow-md" : "border-none bg-card/70 shadow-sm"}
              >
                <CardContent className="p-6 space-y-4">
                  <Badge className={plan.highlight ? "bg-amber-400 text-amber-950" : "bg-slate-300 text-slate-900"}>
                    {plan.tier}
                  </Badge>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.note}</div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    {plan.points.map((point) => (
                      <div key={point} className="flex items-center gap-2">
                        <CheckCircle2 className={plan.highlight ? "w-4 h-4 text-amber-400" : "w-4 h-4 text-slate-400"} /> {point}
                      </div>
                    ))}
                  </div>
                  <Link href="/auth">
                    <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                      Choose {plan.tier}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Sparkles className="w-4 h-4" /> FAQ
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {faqs.map((item) => (
              <Card key={item.q} className="border-none bg-card/70 shadow-sm">
                <CardContent className="p-6 space-y-2">
                  <div className="font-semibold">{item.q}</div>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20">
          <Card className="border-none bg-card/80 shadow-md">
            <CardContent className="p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Ready to journal like a pro?</h2>
                <p className="text-muted-foreground">Start in minutes and see patterns in your trading immediately.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/auth">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline">Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© 2026 EdgeJournal. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href="/security">Security</a>
            <a className="hover:text-foreground" href="/privacy">Privacy</a>
            <a className="hover:text-foreground" href="/roadmap">Roadmap</a>
            <a className="hover:text-foreground" href="/auth">Sign In</a>
            <a className="hover:text-foreground" href="/auth">Get Started</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
