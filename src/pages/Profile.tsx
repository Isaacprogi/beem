import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Crown, LogOut, Timer, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BleemHireCover from "@/assets/bleemhire_cover.jpeg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    user,
    profile,
    signOut,
    subscriptionStatus,
    subscriptionLoading,
    trialInfo,
    isTrialRunning,
    isTrialExpired,
    loading
  } = useAuth();

  const {toast} = useToast()

    const handleCancelSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "customer-portal",
        {
          method: "POST",
          body: { returnUrl: window.location.origin + "/profile" },
        }
      );

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No URL returned from Edge Function");
      }
    } catch (err: any) {
      console.error("Error redirecting to customer portal:", err);
      toast({
        title: "Subscription Portal Error",
        description: "Could not open subscription portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg">You are not signed in.</p>
        <Button className="mt-4" onClick={() => navigate("/sign-in")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background">
        <Header/>
      {/* Cover */}
      {/* <img
        src={BleemHireCover}
        alt="cover"
        className="object-cover w-full"
      /> */}

      <div className="w-full absolute  h-[15rem]  bg-gradient-glow">

      </div>

      <div className="container relative  py-12">
        <Card className="max-w-2xl mx-auto bg-gradient-surface border-0">
          <CardContent className="space-y-6 pt-4">
            {/* User Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {profile?.display_name || "No display name"}
                </span>
                {profile?.role && (
                  <Badge variant="outline" className="ml-2">
                    {profile.role}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Subscription Info */}
            <div>
              <h3 className="font-semibold mb-2">Subscription</h3>
              {subscriptionLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : subscriptionStatus.subscribed ? (
                <div className="space-y-2">
                  <p className="text-sm">
                    Plan:{" "}
                    <span className="font-medium">
                      {subscriptionStatus.subscription_tier}
                    </span>
                  </p>
                  {subscriptionStatus.subscription_end && (
                    <p className="text-sm text-muted-foreground">
                      Renews until:{" "}
                      {new Date(
                        subscriptionStatus.subscription_end
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={handleCancelSubscription}
                  >
                    Manage / Cancel Subscription
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">
                    No active subscription.
                  </p>
                  <Button
                    className="mt-2 bg-gradient-primary hover:shadow-glow"
                    onClick={() => navigate("/pricing")}
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Trial Info */}
            <div>
              <h3 className="font-semibold mb-2">Trial</h3>
              {trialInfo.trialStartedAt ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-primary" />
                    <span>{trialInfo.trialPageViews}/3 pages viewed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="h-4 w-4 text-primary" />
                    <span>
                      {isTrialExpired
                        ? "Expired"
                        : isTrialRunning
                        ? "Trial is active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You haven’t started a trial yet.
                </p>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/jobs")}>
                Back to Jobs
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={signOut}
                disabled={loading}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
