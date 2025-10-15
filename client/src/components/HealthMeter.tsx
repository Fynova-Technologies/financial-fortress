import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthMeterProps {
  score?: number;
  description?: string;
}

export function HealthMeter({ score = 75, description }: HealthMeterProps) {
  const rotation = (score / 100) * 180 - 90;
  
  // Determine health status
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-600" };
    if (score >= 60) return { label: "Good", color: "text-emerald-600" };
    if (score >= 40) return { label: "Fair", color: "text-yellow-600" };
    if (score >= 20) return { label: "Poor", color: "text-orange-600" };
    return { label: "Critical", color: "text-red-600" };
  };

  const status = getHealthStatus(score);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Financial Health Score</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gauge Visualization */}
        <div className="relative flex flex-col items-center">
          <div className="relative h-40 w-80">
            {/* Background arc */}
            <svg className="absolute inset-0" viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                  <stop offset="25%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
                  <stop offset="75%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {/* Gauge arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
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
                  stroke="#1f2937"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="#1f2937" />
              </g>
              {/* Score markers */}
              <text x="20" y="115" fontSize="10" fill="#6b7280" textAnchor="start">0</text>
              <text x="100" y="25" fontSize="10" fill="#6b7280" textAnchor="middle">50</text>
              <text x="180" y="115" fontSize="10" fill="#6b7280" textAnchor="end">100</text>
            </svg>
          </div>
          
          {/* Score display */}
          <div className="mt-4 text-center">
            <div
              className="text-5xl font-bold"
              style={{
                color:
                  status.color === "text-green-600"
                    ? "#059669"
                    : status.color === "text-emerald-600"
                    ? "#10b981"
                    : status.color === "text-yellow-600"
                    ? "#eab308"
                    : status.color === "text-orange-600"
                    ? "#f97316"
                    : "#ef4444",
              }}
            >
              {score}
            </div>
            <div className={`mt-1 text-lg font-semibold ${status.color}`}>
              {status.label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
