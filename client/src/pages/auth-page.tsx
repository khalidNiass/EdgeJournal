import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Eye, EyeOff, Chrome } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, login, register, isLoginPending, isRegisterPending } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [onboarding, setOnboarding] = useState({
    tradingStyle: "",
    primaryGoal: "",
    experience: "",
    markets: "",
  });
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && !showOnboarding) setLocation("/app");
  }, [user, showOnboarding, setLocation]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerSchema = insertUserSchema.extend({
    email: z.string().email("Valid email is required"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  type RegisterForm = z.infer<typeof registerSchema>;

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", confirmPassword: "", email: "" },
  });

  const registerPassword = registerForm.watch("password");
  const passwordStrength = useMemo(() => {
    const value = registerPassword || "";
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    const label =
      score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong";
    return { score, label };
  }, [registerPassword]);

  const handleLogin = (data: LoginForm) => {
    login(data.username, data.password, rememberMe);
    toast({ title: "Welcome back", description: "Logged in successfully." });
  };

  const handleRegister = (data: RegisterForm) => {
    if (!acceptTerms) {
      setTermsError("You must accept the Terms and Privacy Policy.");
      return;
    }
    setTermsError(null);
    register(data.username, data.password);
    setShowOnboarding(true);
    toast({ title: "Account created", description: "Tell us a bit about your trading (optional)." });
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Optional setup</CardTitle>
            <CardDescription>Help us personalize your experience (optional).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Trading style</Label>
              <Input
                placeholder="Breakout, scalping, swing..."
                value={onboarding.tradingStyle}
                onChange={(e) => setOnboarding((prev) => ({ ...prev, tradingStyle: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Primary goal</Label>
              <Select
                value={onboarding.primaryGoal}
                onValueChange={(value) => setOnboarding((prev) => ({ ...prev, primaryGoal: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consistency">Consistency</SelectItem>
                  <SelectItem value="growth">Account growth</SelectItem>
                  <SelectItem value="risk">Risk management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Experience level</Label>
              <Select
                value={onboarding.experience}
                onValueChange={(value) => setOnboarding((prev) => ({ ...prev, experience: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Markets</Label>
              <Input
                placeholder="Forex, Crypto, Stocks..."
                value={onboarding.markets}
                onChange={(e) => setOnboarding((prev) => ({ ...prev, markets: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowOnboarding(false);
                  setLocation("/app");
                }}
              >
                Skip
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setShowOnboarding(false);
                  toast({ title: "Setup saved", description: "Welcome to EdgeJournal!" });
                  setLocation("/app");
                }}
              >
                Finish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column: Form */}
      <div className="flex items-center justify-center px-6 py-8 lg:py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="font-bold text-2xl tracking-tighter">EdgeJournal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your trading journal.</p>
          </div>

          <Tabs value={authTab} onValueChange={(value) => setAuthTab(value as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-1 duration-300">
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Access your dashboard and analytics.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-2.5">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username or Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Username or you@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type={showLoginPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                                <button
                                  type="button"
                                  onClick={() => setShowLoginPassword((prev) => !prev)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(Boolean(v))} />
                          Remember me
                        </label>
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 text-sm"
                          onClick={() => {
                            const currentUser = loginForm.getValues("username");
                            if (currentUser.includes("@")) {
                              setResetEmail(currentUser);
                            }
                            setShowReset(true);
                            setResetSent(false);
                          }}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      {showReset && (
                        <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                          {!resetSent ? (
                            <>
                              <div className="text-sm font-medium">Reset your password</div>
                              <div className="text-xs text-muted-foreground">
                                We’ll send a reset link to your email address.
                              </div>
                              <Input
                                type="email"
                                placeholder="you@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setShowReset(false);
                                    setResetSent(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    setResetSent(true);
                                    toast({ title: "Reset link sent", description: "Check your inbox (demo)." });
                                  }}
                                >
                                  Send reset link
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm">
                              Check your inbox for a reset link.
                              <div className="text-xs text-muted-foreground mt-1">
                                Didn’t receive it? Check spam or resend.
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setResetSent(false)}
                                >
                                  Resend
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setShowReset(false)}
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <Button type="submit" className="w-full" disabled={isLoginPending}>
                        {isLoginPending ? "Logging in..." : "Login"}
                      </Button>
                      <div>
                        <Button type="button" variant="outline" className="gap-2 w-full">
                          <Chrome className="w-4 h-4" /> Continue with Google
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-1 duration-300">
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Start journaling your trades today.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your username</FormLabel>
                              <FormControl>
                                <Input placeholder="Username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Create Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type={showRegisterPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                                <button
                                  type="button"
                                  onClick={() => setShowRegisterPassword((prev) => !prev)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type={showRegisterPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          {[0, 1, 2, 3].map((idx) => (
                            <div
                              key={idx}
                              className={`h-1 flex-1 rounded-full ${
                                passwordStrength.score > idx
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Use 8+ characters, one number, and one symbol.
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] text-muted-foreground leading-snug">
                          <Checkbox checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(Boolean(v))} />
                          By clicking on the Sign Up button you are accepting our Terms of Service and Privacy Policy
                        </label>
                        {termsError && <p className="text-xs text-destructive">{termsError}</p>}
                      </div>
                      <Button type="submit" className="w-full" disabled={isRegisterPending}>
                        {isRegisterPending ? "Creating account..." : "Sign Up"}
                      </Button>
                      <div className="text-center text-sm text-muted-foreground">
                        Already have account?{" "}
                        <button
                          type="button"
                          className="text-primary underline-offset-4 hover:underline"
                          onClick={() => setAuthTab("login")}
                        >
                          Sign In
                        </button>
                      </div>
                      <div>
                        <Button type="button" variant="outline" className="gap-2 w-full">
                          <Chrome className="w-4 h-4" /> Sign up with Google
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column: Hero/Visual */}
      <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-muted/30 border-l border-border relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 backdrop-blur-sm mb-8">
            <TrendingUp className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Master Your Edge</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            "You can't improve what you don't measure." Join thousands of traders who use EdgeJournal to find their profitability.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left mt-8">
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-bold text-primary mb-1">Analytics</h4>
              <p className="text-sm text-muted-foreground">Visualize your win rate and risk profile.</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-bold text-primary mb-1">Journaling</h4>
              <p className="text-sm text-muted-foreground">Record execution notes and emotions.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
