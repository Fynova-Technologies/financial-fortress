import type { Express, Request } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "../storage/storage.js";
import { checkJwt } from "../middleware/auth0Middleware.js";
import { sendVerificationEmail } from "../utils/auth0.js";
import { getManagementToken } from "../utils/auth.js";
import verifyRoutes from "./secureRoutes.js";
import authRoutes from "./secureRoutes.js"

// Auth0 Request Body
interface Auth0RequestBody {
  username: string;
  email: string;
}

interface Auth0Request extends Request<{}, {}, Auth0RequestBody> {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}

// Budget Request Body
interface BudgetRequestBody {
  name: string;
  total_income: number;
  expenseCategories: { id: string; name: string; color: string; amount: string }[];
  expenses: { id: string; description: string; category: string; date: string; amount: number }[];
}

interface BudgetRequest extends Request<{}, {}, BudgetRequestBody> {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}

// Mortgage Calculation Request Body
interface MortgageRequestBody {
  homePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number; 
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
}

interface MortgageRequest extends Request<{}, {}, MortgageRequestBody> {
  auth?: {    
    sub: string;
    [key: string]: any;
  };
}

// EMI Calculation Request Body
interface EmiRequestBody {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  termType: 'years' | 'months';
  startDate: Date; // ISO date string
}

interface EmiRequest extends Request<{}, {}, EmiRequestBody> {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}

// Retirement Calculation Request Body
interface RetirementRequestBody {
  retirementAge: number;
  lifeExpectancy: number;
  inflationRate: number; // in basis points (e.g., 200 for 2.00%)
  desiredMonthlyIncome: number;
  currentAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
}

interface RetirementRequest extends Request<{}, {}, RetirementRequestBody> {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}

// Salary Management Request Body
interface SalaryManagementRequestBody {
  grossSalary: number;
  taxRate: number;
  deductions: number;
  bonuses?: number; // Optional field for bonuses
  period?: 'monthly' | 'annual'; // Optional field for period type
  created_at?: Date; // Optional field for creation date
}

interface SalaryManagementRequest extends Request<{}, {}, SalaryManagementRequestBody> {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}

// ROI Calculation Request Body
interface RoiRequestBody {
  initialInvestment: number;
  additionalContribution: number; // Total additional contributions in dollars
  contributionFrequency: 'monthly' | 'quarterly' | 'annually'; // Frequency of contributions
  annualRate: number; // Annual rate of return in basis points (e.g., 500 for 5.00%)
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually'; // Frequency of compounding
  investmentTerm: number; // Investment term in years
}

interface RoiRequest extends Request<{}, {}, RoiRequestBody> {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}

interface SavingsGoalItem {
  name: string;
  target_amount: string; // Target amount in dollars
  current_amount: string; // Current amount saved in dollars
  target_date: Date; // Target date for the savings goal (ISO date string)
}

interface SavingsGoalArrayRequestBody {
  savingsGoals: SavingsGoalItem[];
}

interface SavingsGoalArrayRequest extends Request<{}, {}, SavingsGoalArrayRequestBody> {
  auth?: {
    sub: string;
    [key: string]: any;
    payload?: any;
    userId?: string;
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
    app.use(express.json());

    app.use("/api/auth", verifyRoutes);
    console.log("verifyroutes", verifyRoutes);

    app.use("/api/auth", authRoutes);

  // ✅ Log all requests
  app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });

  // Create new user
  app.post('/api/register', checkJwt, async (req: Auth0Request, res) => {
    try {
      const auth0_id = req.auth?.sub;
      const { username, email } = req.body;

      if (!auth0_id || !username || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      console.log("req.auth:", req.auth);
      console.log("req.user:", req.user);


      // Check if user already exists by auth0_id
      const existingUserByAuth0 = await storage.getUserByAuth0Id(auth0_id);
      if (existingUserByAuth0) {
        return res.status(400).json({ message: "User with this Auth0 ID already exists" });
      }

      // Check if username is taken
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const newUser = await storage.createUser({ username, email, auth0_id });

      if (!req.auth?.email_verified) {
        console.warn("User has not verified email yet:", auth0_id);
      }

      if(req.auth?.email_verified) {
        console.log("User email is verified:", auth0_id);
      }

      // Trigger verification email
      await sendVerificationEmail(auth0_id);
      console.log("Verification email sent to:", email);

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: "1.Internal server error" });
    }
  });

  // Get logged-in user info
  app.get('/api/protected', checkJwt, async (req: Auth0Request, res) => {
    try {
      const auth0_id = req.auth?.sub;
      
      if (!auth0_id) {
        return res.status(401).json({ error: "No Auth0 ID found" });
      }

      const user = await storage.getUserByAuth0Id(auth0_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ 
        message: "Access granted!", 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: "2.Internal server error" });
    }
  });

  // Get user profile
  app.get('/api/user/profile', checkJwt, async (req: Auth0Request, res) => {
    try {
      const auth0_id = req.auth?.sub;
      console.log('Auth0 ID:', auth0_id);
      if (!auth0_id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUserByAuth0Id(auth0_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: "3.Internal server error" });
    }
  });

  // Create budget
  app.post('/api/budgets', checkJwt, async (req: BudgetRequest, res) => {
    try {
      const auth0_id = req.auth?.sub;
      console.log("Budget creation started");
      console.log("Auth0 ID:", auth0_id);
      
      if (!auth0_id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUserByAuth0Id(auth0_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { name, total_income, expenseCategories, expenses } = req.body;
      console.log("Request body:", req.body);
      console.log("Creating budget with:", {
        user_id: user.id,
        name,
        total_income: total_income.toString(),
        expense_categories: expenseCategories,
        expenses
      });

      const budget = await storage.createCompleteBudget({
        user_id: user.id,
        name,
        total_income: total_income.toString(),
        expense_categories: expenseCategories,
        expenses,
      });

      res.status(201).json(budget);
    } catch (error) {
      console.error('Error creating budget:', error);
      res.status(500).json({ error: "4.Internal server error" });
    }
  });

  // Get user's budgets
  app.get('/api/budgets', checkJwt, async (req: Auth0Request, res) => {
    try {
      const auth0_id = req.auth?.sub;
      console.log('Auth0 ID:', auth0_id);
      if (!auth0_id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUserByAuth0Id(auth0_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const budgets = await storage.getBudgetsByUserId(user.id);
      res.json(budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      res.status(500).json({ error: "5.Internal server error" });
    }
  });

  // Create mortgage calculation
  app.post('/api/mortgage-calculations', checkJwt, async (req: MortgageRequest, res) => {
  try { 
    console.log("Mortgage calculation request received");  
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { homePrice, downPaymentAmount, downPaymentPercent, interestRate, loanTerm, propertyTax, homeInsurance, pmi } = req.body;
    console.log("Request body mortgage:", req.body);

    const mortgageCalculation = await storage.createMortgageCalculation({
      userId: user.id,
      homePrice,
      downPaymentAmount,
      downPaymentPercent,
      interestRate: interestRate.toString(), // Ensure interestRate is a string
      loanTerm,
      propertyTax,
      homeInsurance,
      pmi
    });

    res.status(201).json(mortgageCalculation);
  } catch (error) {
    console.error('Error creating mortgage calculation:', error); 
    res.status(500).json({ error: "6.Internal server error" });
  }
}) 

  // Get user's mortgage calculations
app.get('/api/mortgage-calculations', checkJwt, async (req: Auth0Request, res) => {
  try {   
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const mortgageCalculations = await storage.getMortgageCalculationsByUserId(user.id);
    res.json(mortgageCalculations);
  } catch (error) {
    console.error('Error fetching mortgage calculations:', error);  
    res.status(500).json({ error: "7.Internal server error" });
  }
}
);

// Create EMI calculation
app.post('/api/emi-calculations', checkJwt, async (req: EmiRequest, res) => {
  try { 
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { loanAmount, interestRate, loanTerm, termType, startDate } = req.body;

    const emiCalculation = await storage.createEmiCalculation({
      userId: user.id,
      loanAmount,
      interestRate: interestRate.toString(), // Ensure interestRate is a string
      loanTerm,
      termType,
      startDate: new Date(startDate), // Ensure startDate is a Date object
    });

    res.status(201).json(emiCalculation);
  } catch (error) {
    console.error('Error creating EMI calculation:', error);
    res.status(500).json({ error: "8.Internal server error" });
  }
}
);

// Get user's EMI calculations
app.get('/api/emi-calculations', checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const emiCalculations = await storage.getEmiCalculationsByUserId(user.id);
    res.json(emiCalculations);
  } catch (error) {
    console.error('Error fetching EMI calculations:', error);   
    res.status(500).json({ error: "9.Internal server error" });
  } 
}
);

// Create retirement calculation
app.post('/api/retirement-calculations', checkJwt, async (req: RetirementRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {lifeExpectancy, inflationRate, desiredMonthlyIncome, retirementAge, currentAge, currentSavings, monthlyContribution, expectedReturn } = req.body;
    console.log("Request body retirement:", req.body);

    const retirementCalculation = await storage.createRetirementCalculation({
      userId: user.id,
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyContribution,
      expectedReturn: expectedReturn.toString(), // in basis points (e.g., 500 for 5.00%)
      inflationRate: inflationRate.toString(), // in basis points (e.g., 200 for 2.00%)
      desiredMonthlyIncome,
    });

    res.status(201).json(retirementCalculation);
  } catch (error) {
    console.error('Error creating retirement calculation:', error); 
    res.status(500).json({ error: "10.Internal server error" });
  }
}
);

// Get user's retirement calculations
app.get('/api/retirement-calculations', checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const retirementCalculations = await storage.getRetirementCalculationsByUserId(user.id);
    res.json(retirementCalculations);
  } catch (error) {
    console.error('Error fetching retirement calculations:', error);
    res.status(500).json({ error: "11.Internal server error" });
  }
}
);

// Create salary management
app.post('/api/salary-management', checkJwt, async (req: SalaryManagementRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { grossSalary, taxRate, deductions, bonuses, period } = req.body;

    const salaryManagement = await storage.createSalaryManagement({
      userId: user.id,
      grossSalary,
      taxRate: taxRate.toString(), // Ensure taxRate is a string
      deductions,
      bonuses: bonuses || 0, // Default to 0 if not provided
      period: period || 'monthly' // Default to 'monthly' if not provided
    });

    res.status(201).json(salaryManagement);
  } catch (error) {
    console.error('Error creating salary management:', error); 
    res.status(500).json({ error: "12.Internal server error" });
  }
}
);

// Get user's salary management
app.get('/api/salary-management', checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salaryManagement = await storage.getSalaryManagementByUserId(user.id);
    res.json(salaryManagement);
  } catch (error) {
    console.error('Error fetching salary management:', error); 
    res.status(500).json({ error: "13.Internal server error" });
  }
}
);

// Create ROI calculation
app.post('/api/roi-calculations', checkJwt, async (req: RoiRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { initialInvestment, additionalContribution, contributionFrequency, annualRate, compoundingFrequency, investmentTerm} = req.body;
    console.log("Request body ROI:", req.body);
    const roiCalculation = await storage.createRoiCalculation({
      userId: user.id,
      initialInvestment,
      additionalContribution,
      contributionFrequency,
      annualRate: annualRate.toString(), // in basis points (e.g., 500 for 5.00%)
      compoundingFrequency,
      investmentTerm,
    });

    res.status(201).json(roiCalculation);
  } catch (error) {
    console.error('Error creating ROI calculation:', error);
    res.status(500).json({ error: "14.Internal server error" });
  }
}
);

// Get user's ROI calculations
app.get('/api/roi-calculations', checkJwt, async (req: Auth0Request, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const roiCalculations = await storage.getRoiCalculationsByUserId(user.id);
    res.json(roiCalculations);
  } catch (error) {
    console.error('Error fetching ROI calculations:', error); 
    res.status(500).json({ error: "15.Internal server error" });
  }
}
);

// Create savings goal
app.post('/api/savings-goals', checkJwt, async (req: SavingsGoalArrayRequest, res) => {
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { savingsGoals } = req.body;
    console.log("Request body savings goals:", req.body);

    // Validate that savingsGoals is an array and not empty
    if (!Array.isArray(savingsGoals) || savingsGoals.length === 0) {
      return res.status(400).json({ error: "savingsGoals must be a non-empty array" });
    }

    // Create all savings goals
    const createdGoals = [];
    
    for (const goalData of savingsGoals) {
      const { name, target_amount, current_amount, target_date } = goalData;
      
      // Validate required fields for each goal
      if (!name || !target_amount || !current_amount || !target_date) {
        return res.status(400).json({ 
          error: "Each savings goal must have name, target_amount, current_amount, and target_date" 
        });
      }

      const savingsGoal = await storage.createSavingsGoal({
        userId: user.id,
        name,
        target_amount,
        current_amount,
        target_date: new Date(target_date),
      });
      
      createdGoals.push(savingsGoal);
    }

    res.status(201).json({
      message: `Successfully created ${createdGoals.length} savings goals`,
      savingsGoals: createdGoals
    });
    
  } catch (error) {
    console.error('Error creating savings goals:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's savings goals
app.get('/api/savings-goals', checkJwt, async (req: Auth0Request, res) => { 
  try {
    const auth0_id = req.auth?.sub;
    console.log('Auth0 ID:', auth0_id);
    if (!auth0_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUserByAuth0Id(auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savingsGoals = await storage.getSavingsGoalsByUserId(user.id);
    res.json(savingsGoals);
  } catch (error) {
    console.error('Error fetching savings goals:', error); 
    res.status(500).json({ error: "17.Internal server error" });
  }
}
);

app.get('/api/auth/check-email-verified-public', async (req, res) => {
  try {
    const userId = (req.query.user_id as string) || "";
    if (!userId) {
      return res.status(400).json({ error: "Missing user_id query parameter" });
    }

    const mgmtToken = await getManagementToken();
    if (!mgmtToken) return res.status(500).json({ error: "Failed to get management token" });

    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "dev-l0cnkmnrn4reomjc.us.auth0.com";

    const response = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text || "Auth0 error" });
    }

    const user = await response.json();
    return res.json({ email_verified: !!user.email_verified });
  } catch (err) {
    console.error("check-email-verified-public error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

  const httpServer = createServer(app);
  return httpServer;
}
