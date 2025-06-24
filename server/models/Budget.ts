import { Schema, model, Document } from "mongoose";

export interface IBudget extends Document {
  userId: string;
  name: string;
  amount: number;
  createdAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Budget = model<IBudget>("Budget", BudgetSchema);
