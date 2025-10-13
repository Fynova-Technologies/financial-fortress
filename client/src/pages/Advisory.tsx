import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Philosophy = "FIRE" | "Balanced" | "Conservative" | "Aggressive" | "YOLO";

const philosophyRules: Record<Philosophy, {
  savingsTarget: string;
  debtApproach: string;
  investmentStyle: string;
  emergencyFund: string;
  advice: string;
}> = {
  FIRE: {
    savingsTarget: "50-70% of income",
    debtApproach: "Aggressively pay off high-interest debt first",
    investmentStyle: "Low-cost index funds, maximize tax-advantaged accounts",
    emergencyFund: "6-12 months of expenses",
    advice: "Focus on maximizing your savings rate to achieve financial independence. Every dollar saved brings you closer to early retirement. Prioritize reducing expenses and increasing income streams."
  },
  Balanced: {
    savingsTarget: "15-20% of income",
    debtApproach: "Pay off debt while maintaining retirement savings",
    investmentStyle: "Diversified portfolio with stocks and bonds",
    emergencyFund: "6 months of expenses",
    advice: "Maintain a healthy balance between enjoying life today and preparing for tomorrow. Focus on consistent saving and investing while keeping debt manageable."
  },
  Conservative: {
    savingsTarget: "20-30% of income",
    debtApproach: "Eliminate all debt as quickly as possible",
    investmentStyle: "Safe investments, bonds, high-yield savings",
    emergencyFund: "9-12 months of expenses",
    advice: "Prioritize security and stability. Build a robust emergency fund before investing. Avoid high-risk investments and focus on guaranteed returns."
  },
  Aggressive: {
    savingsTarget: "25-40% of income",
    debtApproach: "Strategic debt - pay off high-interest, leverage low-interest",
    investmentStyle: "High-growth stocks, real estate, entrepreneurship",
    emergencyFund: "3-6 months of expenses",
    advice: "Take calculated risks to maximize wealth growth. Don't be afraid of leverage when the math makes sense. Focus on high-return opportunities while maintaining adequate safety nets."
  },
  YOLO: {
    savingsTarget: "10-15% of income (modest safety net)",
    debtApproach: "Minimum payments, avoid new debt",
    investmentStyle: "Simple, hands-off investing",
    emergencyFund: "3 months of expenses minimum",
    advice: "Life is for living, but don't neglect your future self. Maintain a modest emergency fund and automatic retirement contributions, then enjoy your earnings guilt-free."
  }
};

export default function Advisory() {
  const { toast } = useToast();
  const [philosophy, setPhilosophy] = useState<Philosophy | "">("");
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  // For demo purposes, toggle this to test premium features
  const isPremium = false;

  const handleSubmit = async () => {
    if (!philosophy || !scenario) {
      toast({
        title: "Missing Information",
        description: "Please select a philosophy and describe your scenario.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const rules = philosophyRules[philosophy as Philosophy];
      
      if (isPremium) {
        // Premium: GPT-powered analysis (placeholder)
        setAdvice(
          `**🤖 AI-Powered Analysis (${philosophy} Philosophy)**\n\n**Your Scenario:**\n${scenario}\n\n**Personalized Recommendation:**\n\nBased on your ${philosophy} approach and the specific details you've shared, here's your tailored strategy:\n\n**Immediate Actions:**\n1. Analyze your current debt interest rates vs investment returns\n2. Optimize your tax strategy based on your income bracket\n3. Consider your timeline and adjust risk accordingly\n\n**Long-term Strategy:**\n${rules.advice}\n\n**Investment Allocation:**\n${rules.investmentStyle}\n\n**Savings Target:** ${rules.savingsTarget}\n**Emergency Fund:** ${rules.emergencyFund}\n**Debt Strategy:** ${rules.debtApproach}\n\n**Philosophy Alignment:** This recommendation is specifically tailored to your ${philosophy} goals while accounting for your unique situation. The AI has analyzed your scenario against thousands of similar cases to provide the most relevant guidance.\n\n*Note: This is beginner-friendly advice. Complex strategies require professional consultation.*`
        );
      } else {
        // Basic: Rule-based philosophy advice
        setAdvice(
          `**📋 Rule-Based Advice (${philosophy} Philosophy)**\n\n**Your Scenario:**\n${scenario}\n\n**Core Principles for ${philosophy}:**\n\n${rules.advice}\n\n**Financial Guidelines:**\n\n**Savings Target:** ${rules.savingsTarget}\n- This is what successful people following the ${philosophy} philosophy typically save\n- Start small if needed - even 1% is better than nothing\n- Increase your rate by 1% every few months\n\n**Emergency Fund:** ${rules.emergencyFund}\n- This is your financial safety net\n- Keep it in a high-yield savings account\n- Only use it for true emergencies\n\n**Debt Approach:** ${rules.debtApproach}\n- High-interest debt (>7%) should be priority #1\n- Consider refinancing options for large debts\n- Avoid new debt while paying off existing balances\n\n**Investment Style:** ${rules.investmentStyle}\n- Start with employer 401(k) match (free money!)\n- Then max out Roth IRA ($7,000/year)\n- Keep it simple - don't try to time the market\n\n**Next Steps:**\n1. Track your spending for one month\n2. Calculate your current savings rate\n3. Set up automatic transfers to savings\n4. Review your progress monthly\n\n**💡 Beginner Tips:**\n- Start where you are, use what you have\n- Small consistent actions beat big sporadic efforts\n- Don't compare yourself to others' highlight reels\n- Financial health is a journey, not a destination\n\n**Upgrade to Premium** for AI-powered analysis that considers your specific numbers, timeline, and risk tolerance.`
        );
      }
      setLoading(false);
    }, 1500);
  };

  return (
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advisory Hub</h1>
          <p className="text-muted-foreground">
            Get financial advice tailored to your philosophy
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Request Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
                Request Advice
              </CardTitle>
              <CardDescription>
                {isPremium
                  ? "Get AI-powered insights aligned with your financial philosophy"
                  : "Receive rule-based financial guidance"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="philosophy">Financial Philosophy</Label>
                <Select value={philosophy} onValueChange={(v) => setPhilosophy(v as Philosophy | "")}>
                  <SelectTrigger id="philosophy">
                    <SelectValue placeholder="Select your philosophy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRE">FIRE (Financial Independence, Retire Early)</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                    <SelectItem value="Conservative">Conservative</SelectItem>
                    <SelectItem value="Aggressive">Aggressive</SelectItem>
                    <SelectItem value="YOLO">YOLO (You Only Live Once)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenario">Describe Your Scenario</Label>
                <Textarea
                  id="scenario"
                  placeholder="Example: I'm 30 years old with $50k in savings. Should I invest in stocks or pay off my $20k student loan?"
                  rows={5}
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    {isPremium && <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />}
                    Get Advice
                  </>
                )}
              </Button>

              {!isPremium && (
                <div className="rounded-lg border border-primary bg-primary/5 p-4">
                  <p className="text-sm font-medium">Upgrade to Premium</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Get AI-powered, philosophy-aligned advice for your unique situation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advice Display */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Personalized Advice</CardTitle>
              <CardDescription>
                {advice ? "Review your recommendations" : "Submit a request to see advice"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {advice ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{advice}</div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-20" aria-hidden="true" />
                    <p>Your advice will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
