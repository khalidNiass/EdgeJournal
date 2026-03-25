import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [prefs, setPrefs] = useState({
    dailySummary: true,
    weeklySummary: true,
    tradeReminders: true,
    marketNews: false,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage preferences and account</p>
        </div>
        <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          Settings are in preview mode. Changes are saved locally until backend sync is enabled.
        </div>

        <Card className="border-none bg-card/70 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Dark mode</div>
                <div className="text-xs text-muted-foreground">Toggle the app theme</div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Daily summary</div>
                <div className="text-xs text-muted-foreground">Receive a daily performance email</div>
              </div>
              <Switch
                checked={prefs.dailySummary}
                onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, dailySummary: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Weekly summary</div>
                <div className="text-xs text-muted-foreground">Weekly performance recap</div>
              </div>
              <Switch
                checked={prefs.weeklySummary}
                onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, weeklySummary: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Trade reminders</div>
                <div className="text-xs text-muted-foreground">Get nudges to journal after a trade</div>
              </div>
              <Switch
                checked={prefs.tradeReminders}
                onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, tradeReminders: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Market news</div>
                <div className="text-xs text-muted-foreground">Weekly macro and volatility recap</div>
              </div>
              <Switch
                checked={prefs.marketNews}
                onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, marketNews: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/70 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">Update your password</p>
            </div>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Password updates will be fully enabled when backend authentication is connected.
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast({ title: "Password update", description: "Password change coming soon." })}
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/70 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Account</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setLocation("/app/profile/edit")}>Edit Profile</Button>
              <Button variant="outline" onClick={() => setLocation("/app/profile/upgrade")}>Manage Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
