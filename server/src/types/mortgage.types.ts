import type { Request } from "express";

export interface MortgageRequestBody {
  homePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
}
export interface MortgageRequest extends Request<{}, {}, MortgageRequestBody> {
  auth?: { sub: string; [key: string]: any };
}