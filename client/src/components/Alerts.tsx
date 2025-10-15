import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Bell, 
  TrendingUp, 
  Target, 
  Shield,
  DollarSign,
  CheckCircle2,
  X
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AlertType = "behavioral" | "goal" | "risk" | "commitment";
type AlertSeverity = "info" | "warning" | "critical";

interface UserAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  actionable: boolean;
  timestamp: Date;
  dismissed: boolean;
}

export default function Alerts() {
  const [_, navigate] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", description: "" });
  
  const [alerts, setAlerts] = useState<UserAlert[]>([
    {
      id: "1",
      type: "behavioral",
      severity: "warning",
      title: "High Spending Alert",
      message: "You've spent 85% of your monthly entertainment budget with 2 weeks remaining.",
      actionable: true,
      timestamp: new Date(),
      dismissed: false
    },
    {
      id: "2",
      type: "goal",
      severity: "info",
      title: "Goal Milestone Reached",
      message: "Congratulations! You've reached 50% of your Emergency Fund goal.",
      actionable: false,
      timestamp: new Date(Date.now() - 86400000),
      dismissed: false
    },
    {
      id: "3",
      type: "risk",
      severity: "critical",
      title: "Low Emergency Fund",
      message: "Your emergency fund covers less than 3 months of expenses. Consider prioritizing savings.",
      actionable: true,
      timestamp: new Date(Date.now() - 172800000),
      dismissed: false
    },
    {
      id: "4",
      type: "commitment",
      severity: "info",
      title: "Auto-Save Increase Due",
      message: "It's time to increase your auto-save by 5% as per your commitment device.",
      actionable: true,
      timestamp: new Date(Date.now() - 259200000),
      dismissed: false
    },
    {
      id: "5",
      type: "behavioral",
      severity: "critical",
      title: "Unusual Transaction Pattern",
      message: "Multiple large transactions detected ($500+). Review your recent spending.",
      actionable: true,
      timestamp: new Date(Date.now() - 345600000),
      dismissed: false
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    behavioral: true,
    goal: true,
    risk: true,
    commitment: true,
    email: true,
    push: false
  });

  const [commitmentDevices, setCommitmentDevices] = useState({
    autoSaveIncrease: true,
    spendingLimit: true,
    goalDeadlines: true
  });

  const [spendingLimit, setSpendingLimit] = useState("500");

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalAlerts = activeAlerts.filter(a => a.severity === "critical");
  const warningAlerts = activeAlerts.filter(a => a.severity === "warning");
  const infoAlerts = activeAlerts.filter(a => a.severity === "info");

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical": return "destructive";
      case "warning": return "default";
      case "info": return "default";
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "info": return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case "behavioral": return <TrendingUp className="h-4 w-4" />;
      case "goal": return <Target className="h-4 w-4" />;
      case "risk": return <Shield className="h-4 w-4" />;
      case "commitment": return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleTakeAction = (alert: UserAlert) => {
    switch (alert.type) {
      case "behavioral":
        navigate("/dashboard");
        toast({
          title: "Navigating to Dashboard",
          description: "Review your spending and adjust your budget.",
        });
        break;
      case "goal":
        navigate("/goals");
        toast({
          title: "Navigating to Goals",
          description: "Check your progress and update your goals.",
        });
        break;
      case "risk":
        navigate("/dashboard");
        toast({
          title: "Navigating to Dashboard",
          description: "Review your financial health metrics.",
        });
        break;
      case "commitment":
        toast({
          title: "Settings Updated",
          description: "Your commitment device has been activated.",
        });
        break;
    }
  };

  const handleLearnMore = (alert: UserAlert) => {
    let title = "";
    let description = "";
    
    switch (alert.type) {
      case "behavioral":
        title = "About Behavioral Alerts";
        description = "Behavioral alerts help you identify spending patterns and prevent budget overages. Based on nudge theory, these alerts encourage better financial decisions by making you aware of your habits in real-time.";
        break;
      case "goal":
        title = "About Goal Reminders";
        description = "Goal reminders keep you motivated by celebrating milestones and prompting you to stay on track. Regular check-ins help maintain momentum toward your financial objectives.";
        break;
      case "risk":
        title = "About Risk Alerts";
        description = "Risk alerts warn you about potential financial vulnerabilities, such as low emergency funds or high debt ratios. These are critical for maintaining financial health and security.";
        break;
      case "commitment":
        title = "About Commitment Devices";
        description = "Commitment devices are behavioral tools that help you stick to your financial goals through automated actions like auto-save increases or spending limits. They work by removing the need for constant willpower.";
        break;
    }
    
    setDialogContent({ title, description });
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Alerts & Nudges</h1>
        <p className="text-muted-foreground">
          Stay on track with timely notifications and commitment devices
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Review when convenient
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infoAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Informational updates
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="commitment">Commitment Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                <p className="text-lg font-semibold">All Clear!</p>
                <p className="text-sm text-muted-foreground">No active alerts at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{alert.title}</CardTitle>
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getTypeIcon(alert.type)}
                              {alert.type}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {formatTimestamp(alert.timestamp)}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{alert.message}</p>
                    {alert.actionable && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleTakeAction(alert)}>
                          Take Action
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLearnMore(alert)}>
                          Learn More
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which alerts you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Alert Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <Label htmlFor="behavioral">Behavioral Alerts</Label>
                    </div>
                    <Switch
                      id="behavioral"
                      checked={notificationSettings.behavioral}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, behavioral: checked })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Get notified about spending patterns and budget overages
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <Label htmlFor="goal">Goal Reminders</Label>
                    </div>
                    <Switch
                      id="goal"
                      checked={notificationSettings.goal}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, goal: checked })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Track progress and receive milestone updates
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <Label htmlFor="risk">Risk & Health Alerts</Label>
                    </div>
                    <Switch
                      id="risk"
                      checked={notificationSettings.risk}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, risk: checked })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Important alerts about financial health and security
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <Label htmlFor="commitment">Commitment Devices</Label>
                    </div>
                    <Switch
                      id="commitment"
                      checked={notificationSettings.commitment}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, commitment: checked })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Automated savings increases and spending limits
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-sm font-semibold">Delivery Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email Notifications</Label>
                    <Switch
                      id="email"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, email: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push">Push Notifications</Label>
                    <Switch
                      id="push"
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, push: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commitment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commitment Devices</CardTitle>
              <CardDescription>
                Automated tools to help you stick to your financial goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Commitment devices use behavioral economics to help you make better financial decisions by setting up automatic rules and constraints.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-save">Auto-Save Increases</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically increase savings contribution by 5% every quarter
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={commitmentDevices.autoSaveIncrease}
                      onCheckedChange={(checked) =>
                        setCommitmentDevices({ ...commitmentDevices, autoSaveIncrease: checked })
                      }
                    />
                  </div>
                  {commitmentDevices.autoSaveIncrease && (
                    <Alert className="bg-success/10 border-success">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <AlertDescription>
                        Next increase scheduled: January 1st, 2026 (+$50/month)
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="spending-limit">Daily Spending Limit</Label>
                      <p className="text-sm text-muted-foreground">
                        Set a hard limit on discretionary spending per day
                      </p>
                    </div>
                    <Switch
                      id="spending-limit"
                      checked={commitmentDevices.spendingLimit}
                      onCheckedChange={(checked) =>
                        setCommitmentDevices({ ...commitmentDevices, spendingLimit: checked })
                      }
                    />
                  </div>
                  {commitmentDevices.spendingLimit && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="limit-amount">Daily Limit:</Label>
                      <Input
                        id="limit-amount"
                        type="number"
                        value={spendingLimit}
                        onChange={(e) => setSpendingLimit(e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">per day</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="goal-deadlines">Strict Goal Deadlines</Label>
                      <p className="text-sm text-muted-foreground">
                        Lock in goal deadlines and receive escalating reminders
                      </p>
                    </div>
                    <Switch
                      id="goal-deadlines"
                      checked={commitmentDevices.goalDeadlines}
                      onCheckedChange={(checked) =>
                        setCommitmentDevices({ ...commitmentDevices, goalDeadlines: checked })
                      }
                    />
                  </div>
                  {commitmentDevices.goalDeadlines && (
                    <Alert className="bg-primary/10 border-primary">
                      <Target className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        3 goals with active deadlines. You'll receive weekly reminders as deadlines approach.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold mb-3">How Commitment Devices Work</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• <strong>Auto-Save Increases:</strong> Gradually build better savings habits without feeling the pinch</p>
                  <p>• <strong>Spending Limits:</strong> Prevent impulsive purchases by setting hard daily constraints</p>
                  <p>• <strong>Goal Deadlines:</strong> Create urgency and accountability for your financial targets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription className="pt-4">
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
