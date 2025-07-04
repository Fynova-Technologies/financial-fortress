
import React from "react";

interface IncomeInputProps {
  income: number | "";
  setIncome: (value: number | "") => void;
  onSubmit: () => void;
}

const IncomeInput: React.FC<IncomeInputProps> = ({ income, setIncome, onSubmit }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Add Income and Expenses</h3>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0 w-full">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Add Total Income
          </p>
          <input
            type="number"
            id="income"
            value={income}
            onChange={(e) =>
              setIncome(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="px-3 md:px-6 lg:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: "black" }}
            placeholder="Enter income"
          />
        </div>
        <button
            onClick={(e) => {e.preventDefault(); onSubmit();}}
            className="px-5 md:px-10 lg:px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 mt-8"
        >
            Submit
        </button>
      </div>
    </>
  );
};

export default IncomeInput;
