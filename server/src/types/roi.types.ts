import type { Request } from "express";

export interface RoiRequestBody {
  initialInvestment: number;
  additionalContribution: number;
  contributionFrequency: "monthly" | "quarterly" | "annually";
  annualRate: number;
  compoundingFrequency: "daily" | "monthly" | "quarterly" | "annually";
  investmentTerm: number;
}
export interface RoiRequest extends Request<{}, {}, RoiRequestBody> {
  auth?: { sub: string; [key: string]: any };
}