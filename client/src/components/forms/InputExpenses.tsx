
import React from "react";

interface ExpenseInputProps {
  expense: number | "";
  setExpense: (value: number | "") => void;
}

const ExpenseInput: React.FC<ExpenseInputProps> = ({ expense, setExpense }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0 w-full">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Add Total Expenses
          </p>
          <input
            type="number"
            id="expense"
            value={expense}
            onChange={(e) =>
              setExpense(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: "black" }}
            placeholder="Enter expense"
          />
        </div>
      </div>
    </>
  );
};

export default ExpenseInput;
