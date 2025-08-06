CREATE TABLE "mortgage_calculations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"home_price" integer NOT NULL,
	"down_payment_amount" integer NOT NULL,
	"down_payment_percent" integer NOT NULL,
	"loan_term" integer NOT NULL,
	"interest_rate" integer NOT NULL,
	"property_tax" integer NOT NULL,
	"home_insurance" integer NOT NULL,
	"pmi" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
