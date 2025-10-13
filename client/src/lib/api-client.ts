import { User } from "@auth0/auth0-react";

/**
 * API Client for Financial Fortress backend
 * Handles authentication token injection and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

interface ApiClientOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an authenticated API request
   */
  async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const { method = "GET", body, token } = options;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Financial Data Endpoints
  async getFinancialHealth(token: string) {
    return this.request("/financial-health", { token });
  }

  async getNetWorthHistory(token: string) {
    return this.request("/net-worth-history", { token });
  }

  async calculateEMI(token: string, data: { principal: number; rate: number; tenure: number }) {
    return this.request("/calculators/emi", { method: "POST", token, body: data });
  }

  async calculateRetirement(
    token: string,
    data: { currentAge: number; retirementAge: number; monthlyExpenses: number; inflation: number }
  ) {
    return this.request("/calculators/retirement", { method: "POST", token, body: data });
  }

  // Goals Endpoints
  async getGoals(token: string) {
    return this.request("/goals", { token });
  }

  async createGoal(token: string, data: { name: string; target: number; current: number; deadline: string }) {
    return this.request("/goals", { method: "POST", token, body: data });
  }

  async updateGoal(token: string, goalId: string, data: Partial<{ current: number; deadline: string }>) {
    return this.request(`/goals/${goalId}`, { method: "PATCH", token, body: data });
  }

  // Advisory Endpoints
  async getAdvisoryInsights(
    token: string,
    data: { philosophy: string; scenario: string; userContext: Record<string, unknown> }
  ) {
    return this.request("/advisory/insights", { method: "POST", token, body: data });
  }

  async getBasicAdvice(token: string, scenario: string) {
    return this.request("/advisory/basic", { method: "POST", token, body: { scenario } });
  }

  async getPremiumAdvice(
    token: string,
    data: { philosophy: string; scenario: string; userContext: Record<string, unknown> }
  ) {
    return this.request("/advisory/premium", { method: "POST", token, body: data });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Mock data generator for development
export const mockApiResponses = {
  financialHealth: {
    healthScore: 72,
    savingsRate: 18,
    debtToIncome: 28,
    emergencyFundMonths: 4.5,
  },
  netWorthHistory: [
    { month: "Jan", netWorth: 45000 },
    { month: "Feb", netWorth: 48000 },
    { month: "Mar", netWorth: 50000 },
    { month: "Apr", netWorth: 52000 },
    { month: "May", netWorth: 55000 },
    { month: "Jun", netWorth: 58000 },
  ],
  goals: [
    {
      id: "1",
      name: "Emergency Fund",
      target: 30000,
      current: 22500,
      deadline: "2025-12-31",
    },
    {
      id: "2",
      name: "Down Payment",
      target: 80000,
      current: 35000,
      deadline: "2026-06-30",
    },
  ],
};
