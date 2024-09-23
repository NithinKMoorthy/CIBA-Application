'use client'
import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// Sample data for the line chart
const data = [
  { name: 'Jan', income: 3000 },
  { name: 'Feb', income: 3500 },
  { name: 'Mar', income: 2800 },
  { name: 'Apr', income: 4000 },
  { name: 'May', income: 4500 },
  { name: 'Jun', income: 4700 },
  { name: 'Jul', income: 5000 },
  { name: 'Aug', income: 6421 }, // August's total income
];

const TotalIncomeCard = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full ml-2">
      {/* Title and Date */}
      <div className="mb-2">
        <h3 className="text-md font-bold">Total Income</h3>
        <p className="text-gray-500">August 2023</p>
      </div>

      {/* Total Income Amount */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">$6,421.10</h2>
        <div className="flex items-center text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <span className="text-sm font-bold">2.0%</span>
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <Tooltip />
          <Line type="monotone" dataKey="income" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalIncomeCard;
