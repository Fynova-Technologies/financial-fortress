import type { Request } from "express";
import type { RetirementCalculation } from "../models";

export interface RetirementRequestBody {
  retirementAge: number;
  lifeExpectancy: number;
  inflationRate: number;
  desiredMonthlyIncome: number;
  currentAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
}

export interface RetirementRequest extends Request<{}, {}, RetirementRequestBody> {
  auth?: { sub: string; [key: string]: any };
}
