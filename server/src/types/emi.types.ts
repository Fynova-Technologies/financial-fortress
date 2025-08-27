import type { Request } from "express";

export interface EmiRequestBody {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  termType: "years" | "months";
  startDate: string | Date;
}
export interface EmiRequest extends Request<{}, {}, EmiRequestBody> {
  auth?: { sub: string; [key: string]: any };
}