CREATE TABLE "emi_calculations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"loan_amount" integer NOT NULL,
	"interest_rate" integer NOT NULL,
	"loan_term" integer NOT NULL,
	"term_type" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "retirement_calculations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"current_age" integer NOT NULL,
	"retirement_age" integer NOT NULL,
	"life_expectancy" integer NOT NULL,
	"current_savings" integer NOT NULL,
	"monthly_contribution" integer NOT NULL,
	"expected_return" integer NOT NULL,
	"inflation_rate" integer NOT NULL,
	"desired_monthly_income" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roi_calculations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"investment_amount" integer NOT NULL,
	"addition_contributions" integer NOT NULL,
	"contribution_frequency" text NOT NULL,
	"annual_rate" integer NOT NULL,
	"compounding_frequency" text NOT NULL,
	"investment_term" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "salary_management" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"gross_salary" integer NOT NULL,
	"tax_rate" integer NOT NULL,
	"deductions" integer NOT NULL,
	"bonuses" integer NOT NULL,
	"period" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
