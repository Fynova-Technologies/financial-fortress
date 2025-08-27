import type { Request } from "express";

export interface SalaryManagementRequestBody {
  grossSalary: number;
  taxRate: number;
  deductions: number;
  bonuses?: number;
  period?: "monthly" | "annual";
  created_at?: Date;
}
export interface SalaryManagementRequest
  extends Request<{}, {}, SalaryManagementRequestBody> {
  auth?: { sub: string; [key: string]: any };
}