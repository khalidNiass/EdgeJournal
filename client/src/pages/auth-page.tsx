import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  const loginForm = useForm<Pick<InsertUser, "username" | "password">>({
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "" },
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column: Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="font-bold text-2xl tracking-tighter">EdgeJournal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your trading journal.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Access your dashboard and analytics.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="trader123" {...field} />
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
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Start journaling your trades today.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit((d) => registerMutation.mutate(d))} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="trader123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
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
