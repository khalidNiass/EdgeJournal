import DashboardLayout from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function EditProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [profile, setProfile] = useState({
    displayName: user?.username ?? "",
    email: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    tradingStyle: "",
    bio: "",
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => setLocation("/app/profile")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-muted-foreground mt-1">Update your account details</p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Trader name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={profile.timezone}
                  onChange={(e) => setProfile((prev) => ({ ...prev, timezone: e.target.value }))}
                  placeholder="UTC"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="style">Trading style</Label>
                <Input
                  id="style"
                  value={profile.tradingStyle}
                  onChange={(e) => setProfile((prev) => ({ ...prev, tradingStyle: e.target.value }))}
                  placeholder="Breakouts, scalping, swing"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Short intro about your trading approach"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => toast({ title: "Profile updated", description: "Changes saved locally (demo)." })}
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setLocation("/app/profile")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
