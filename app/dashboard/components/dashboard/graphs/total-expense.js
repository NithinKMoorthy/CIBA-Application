'use client'
import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// Sample data for the line chart
const data = [
  { name: 'Jan', expends: 800 },
  { name: 'Feb', expends: 700 },
  { name: 'Mar', expends: 650 },
  { name: 'Apr', expends: 600 },
  { name: 'May', expends: 550 },
  { name: 'Jun', expends: 500 },
  { name: 'Jul', expends: 450 },
  { name: 'Aug', expends: 561 }, // August's total expense
];

const TotalExpendsCard = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full ml-2 ">
      {/* Title and Date */}
      <div className="mb-2">
        <h3 className="text-md font-bold">Total Expends</h3>
        <p className="text-gray-500">August 2023</p>
      </div>

      {/* Total Expense Amount */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">$561.34</h2>
        <div className="flex items-center text-red-500">
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <span className="text-sm font-bold">1.0%</span>
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <Tooltip />
          <Line type="monotone" dataKey="expends" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalExpendsCard;
