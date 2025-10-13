import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthMeterProps {
  score: number; // 0-100
  label?: string;
  description?: string;
}

export const HealthMeter = ({ score, label = "Financial Health", description }: HealthMeterProps) => {
  const healthData = useMemo(() => {
    if (score >= 80) return { status: "Excellent", color: "health-excellent", textColor: "text-health-excellent" };
    if (score >= 65) return { status: "Good", color: "health-good", textColor: "text-health-good" };
    if (score >= 50) return { status: "Fair", color: "health-fair", textColor: "text-health-fair" };
    if (score >= 35) return { status: "Poor", color: "health-poor", textColor: "text-health-poor" };
    return { status: "Critical", color: "health-critical", textColor: "text-health-critical" };
  }, [score]);

  const rotation = (score / 100) * 180 - 90;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {/* Gauge */}
          <div className="relative h-48 w-full max-w-sm">
            <svg
              viewBox="0 0 200 120"
              className="h-full w-full"
              role="img"
              aria-label={`Financial health meter showing ${score} out of 100, status: ${healthData.status}`}
            >
              {/* Background arc zones */}
              <path
                d="M 20 100 A 80 80 0 0 1 100 20"
                fill="none"
                stroke="hsl(var(--health-critical))"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 100 20 A 80 80 0 0 1 135 30"
                fill="none"
                stroke="hsl(var(--health-poor))"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 135 30 A 80 80 0 0 1 165 70"
                fill="none"
                stroke="hsl(var(--health-fair))"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 165 70 A 80 80 0 0 1 175 90"
                fill="none"
                stroke="hsl(var(--health-good))"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 175 90 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="hsl(var(--health-excellent))"
                strokeWidth="20"
                strokeLinecap="round"
              />

              {/* Needle */}
              <g transform={`rotate(${rotation} 100 100)`}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="35"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="hsl(var(--foreground))" />
              </g>
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className={`text-4xl font-bold ${healthData.textColor}`}>
                {score}
              </span>
              <span className="text-sm text-muted-foreground">out of 100</span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <p className={`text-2xl font-semibold ${healthData.textColor}`}>
              {healthData.status}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
