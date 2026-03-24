import DashboardLayout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
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
          <p className="text-muted-foreground mt-1">Manage preferences and account (UI preview)</p>
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
